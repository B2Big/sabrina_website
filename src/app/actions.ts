'use server'

import { z } from "zod";
import { sendReservationToSabrina, sendConfirmationToCustomer } from "@/lib/resend";
import { prisma } from "@/lib/db-services";

const ContactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Veuillez entrer un numéro de téléphone valide (10 chiffres)"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  cart: z.string().optional(), // JSON stringifié du panier
});

export async function sendContactEmail(prevState: any, formData: FormData) {
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

    console.log("📧 Tentative d'envoi d'emails pour:", name);
    console.log("📦 Cart items:", cartItems?.length || 0, "items");

    // 1. Envoyer email à Sabrina (notification de réservation)
    try {
      const sabrinaresult = await sendReservationToSabrina({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message: message,
        cartItems,
        total,
      });

      console.log("✅ Email PROPRIETAIRE envoyé avec succès:", JSON.stringify(sabrinaresult));
    } catch (sabraError) {
      console.error("❌ ERREUR email PROPRIETAIRE:", sabraError);
      // On continue quand même pour envoyer l'email client
    }

    // 2. Envoyer email de confirmation au client
    try {
      const customerResult = await sendConfirmationToCustomer({
        customerName: name,
        customerEmail: email,
        message: message,
        cartItems,
        total,
      });

      console.log("✅ Email CLIENT envoyé avec succès:", JSON.stringify(customerResult));
    } catch (clientError) {
      console.error("❌ ERREUR email CLIENT:", clientError);
      throw clientError; // Si l'email client échoue, on throw
    }

    // 3. Inscrire à la newsletter si opt-in
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
            console.log("✅ Client réabonné à la newsletter:", email);
          }
        } else {
          await prisma.newsletterSubscriber.create({
            data: { email, name, source: 'contact_form', isSubscribed: true }
          });
          console.log("✅ Nouvel abonné newsletter:", email);
        }
      } catch (nlError) {
        console.error("❌ Erreur inscription newsletter:", nlError);
      }
    }

    return {
      success: true,
      message: "Réservation confirmée ! Vous recevrez un email de confirmation."
    };

  } catch (error) {
    console.error("❌ Erreur globale lors de l'envoi des emails:", error);
    return {
        success: false,
        message: "Une erreur est survenue. Veuillez réessayer ou contactez-nous directement."
    };
  }
}
