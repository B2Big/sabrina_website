'use server'

import { z } from "zod";
import { 
  sendConfirmationToCustomerSurPlace, 
  sendNotificationToSabrinaSurPlace,
  sendConfirmationToCustomer,
  sendReservationToSabrina
} from "@/lib/resend";
import { prisma } from "@/lib/db-services";

// ============================================
// SCHÉMAS DE VALIDATION
// ============================================

const ContactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Veuillez entrer un numéro de téléphone valide (10 chiffres)"),
  message: z.string().optional().default("Réservation via formulaire"),
  cart: z.string().optional(), // JSON stringifié du panier
  serviceDate: z.string().optional().nullable(), // Date souhaitée (optionnelle, peut être null)
});

// ============================================
// FLUX 1: PAIEMENT SUR PLACE (AVEC RÉSERVATION)
// ============================================

/**
 * Crée une réservation avec statut "attente_paiement_sur_place" et envoie les emails
 * Déclenché par le bouton "Réserver et régler sur place"
 */
export async function createReservationSurPlace(prevState: any, formData: FormData) {
  console.log("📝 [SUR PLACE] Création d'une réservation...");

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    cart: formData.get("cart"),
    serviceDate: formData.get("serviceDate"),
    newsletter: formData.get("newsletter"),
  };

  console.log("📋 [SUR PLACE] Données reçues:", {
    name: rawData.name,
    email: rawData.email,
    phone: rawData.phone ? `${(rawData.phone as string).length} caractères` : 'vide',
    message: rawData.message ? `${(rawData.message as string).length} caractères` : 'vide',
    hasCart: !!rawData.cart,
  });

  // Validation Zod
  const result = ContactSchema.safeParse(rawData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join(' | ');
    console.error("❌ [SUR PLACE] Validation échouée:", fieldErrors);
    return { 
      success: false, 
      errors: fieldErrors,
      message: `Erreurs: ${errorMessages}`
    };
  }

  const { name, email, phone, message, cart, serviceDate } = result.data;

  try {
    // Parser le panier
    let cartItems: Array<{ title: string; price: string; quantity: number }> = [];
    let total = "0";

    if (cart) {
      try {
        const parsedCart = JSON.parse(cart);
        cartItems = parsedCart.items || [];
        total = parsedCart.total || "0";
      } catch (e) {
        console.error("❌ Erreur parsing cart:", e);
        return { success: false, message: "Erreur lors de la lecture du panier." };
      }
    }

    if (cartItems.length === 0) {
      console.error("❌ [SUR PLACE] Panier vide");
      return { 
        success: false, 
        errors: { cart: ['Veuillez ajouter au moins un service au panier'] },
        message: "Veuillez ajouter au moins un service au panier."
      };
    }

    // Calculer le total numérique
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);

    console.log("📦 Services:", cartItems.map(i => `${i.quantity}x ${i.title}`).join(', '));
    console.log("💰 Total:", totalAmount, "€");

    // 1. CRÉER LA RÉSERVATION EN BASE DE DONNÉES
    const reservation = await prisma.reservation.create({
      data: {
        status: 'attente_paiement_sur_place',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message: message,
        serviceTitle: cartItems.map(i => i.title).join(', '),
        servicePrice: parseFloat(cartItems[0].price) || 0, // Prix du premier service
        quantity: cartItems.reduce((acc, i) => acc + i.quantity, 0),
        totalAmount: totalAmount,
        paymentMethod: 'sur_place',
        requestedDate: serviceDate ? new Date(serviceDate) : null,
      }
    });

    console.log("✅ Réservation créée");
    console.log("📊 Réservation enregistrée");

    // 2. ENVOYER EMAIL AU CLIENT (Confirmation - Paiement sur place)
    let clientEmailError = null;
    try {
      const emailResult = await sendConfirmationToCustomerSurPlace({
        customerName: name,
        customerEmail: email,
        reservationId: reservation.id,
        services: cartItems,
        total: totalAmount,
        requestedDate: serviceDate,
      });
      console.log("✅ Email CLIENT [SUR PLACE] envoyé");
    } catch (emailError: any) {
      clientEmailError = emailError?.message || String(emailError);
      console.error("❌ Erreur email CLIENT");
      // On continue même si l'email échoue (la réservation est créée)
    }

    // 3. ENVOYER EMAIL AU PROPRIÉTAIRE (Notification - À percevoir)
    let sabrinaEmailError = null;
    try {
      const emailResult = await sendNotificationToSabrinaSurPlace({
        reservationId: reservation.id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        services: cartItems,
        total: totalAmount,
        message: message,
        requestedDate: serviceDate,
      });
      console.log("✅ Email SABRINA [SUR PLACE] envoyé");
    } catch (emailError: any) {
      sabrinaEmailError = emailError?.message || String(emailError);
      console.error("❌ Erreur email SABRINA");
    }

    // 4. INSCRIRE À LA NEWSLETTER SI OPT-IN
    if (rawData.newsletter === "on") {
      try {
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email }
        });

        if (existingSubscriber) {
          if (!existingSubscriber.isSubscribed) {
            await prisma.newsletterSubscriber.update({
              where: { email },
              data: { 
                isSubscribed: true, 
                subscribedAt: new Date(), 
                unsubscribedAt: null,
                name: name // Mettre à jour le nom au cas où
              }
            });
            console.log("✅ Client réabonné à la newsletter");
          }
        } else {
          await prisma.newsletterSubscriber.create({
            data: { 
              email, 
              name, 
              source: 'reservation_sur_place', 
              isSubscribed: true 
            }
          });
          console.log("✅ Nouvel abonné newsletter");
        }
      } catch (nlError) {
        console.error("❌ Erreur inscription newsletter:", nlError);
        // Non bloquant
      }
    }

    // 5. RETOURNER LE SUCCÈS (avec info si email a échoué)
    let successMessage = "Réservation confirmée !";
    if (clientEmailError || sabrinaEmailError) {
      successMessage += " Note: L'email de confirmation n'a pas pu être envoyé (notre équipe a été notifiée).";
      console.warn("[SUR PLACE] Réservation créée mais emails échoués");
    } else {
      successMessage += " Un email de confirmation vous a été envoyé.";
    }
    
    return {
      success: true,
      message: successMessage,
      reservationId: reservation.id,
      emailErrors: { client: clientEmailError, sabrina: sabrinaEmailError },
    };

  } catch (error) {
    console.error("❌ Erreur création réservation");
    return {
      success: false,
      message: "Une erreur est survenue lors de la création de la réservation. Veuillez réessayer."
    };
  }
}

// ============================================
// FLUX LEGACY: Formulaire de contact simple (sans panier)
// ============================================

/**
 * @deprecated Utiliser createReservationSurPlace pour les réservations avec panier
 * Cette fonction reste pour compatibilité avec les formulaires simples
 */
export async function sendContactEmail(prevState: any, formData: FormData) {
  console.log("📧 [LEGACY] Envoi email de contact simple");

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    cart: formData.get("cart"),
    newsletter: formData.get("newsletter"),
  };

  const result = ContactSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const { name, email, phone, message, cart } = result.data;

  try {
    // Parser le panier si présent
    let cartItems: Array<{ title: string; price: string; quantity: number }> | undefined;
    let total: string | undefined;

    if (cart) {
      try {
        const parsedCart = JSON.parse(cart);
        cartItems = parsedCart.items;
        total = parsedCart.total;
      } catch (e) {
        console.error("❌ Erreur parsing cart:", e);
      }
    }

    console.log("📧 Envoi emails legacy");

    // Utiliser les anciennes fonctions pour compatibilité
    // 1. Email à Sabrina
    try {
      await sendReservationToSabrina({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message: message,
        cartItems,
        total,
      });
      console.log("✅ Email PROPRIETAIRE (legacy) envoyé");
    } catch (sabraError) {
      console.error("❌ ERREUR email PROPRIETAIRE:", sabraError);
    }

    // 2. Email au client
    try {
      await sendConfirmationToCustomer({
        customerName: name,
        customerEmail: email,
        message: message,
        cartItems,
        total,
      });
      console.log("✅ Email CLIENT (legacy) envoyé");
    } catch (clientError) {
      console.error("❌ ERREUR email CLIENT:", clientError);
      throw clientError;
    }

    // 3. Newsletter
    if (rawData.newsletter === "on") {
      try {
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email }
        });

        if (existingSubscriber) {
          if (!existingSubscriber.isSubscribed) {
            await prisma.newsletterSubscriber.update({
              where: { email },
              data: { isSubscribed: true, subscribedAt: new Date(), unsubscribedAt: null }
            });
            console.log("✅ Client réabonné à la newsletter");
          }
        } else {
          await prisma.newsletterSubscriber.create({
            data: { email, name, source: 'contact_form', isSubscribed: true }
          });
          console.log("✅ Nouvel abonné newsletter");
        }
      } catch (nlError) {
        console.error("❌ Erreur inscription newsletter:", nlError);
      }
    }

    return {
      success: true,
      message: "Message envoyé ! Vous recevrez une réponse sous 24h."
    };

  } catch (error) {
    console.error("❌ Erreur globale:", error);
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer."
    };
  }
}
