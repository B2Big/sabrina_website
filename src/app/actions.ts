'use server'

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export async function sendContactEmail(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  const result = ContactSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const { name, email, phone, message } = result.data;

  try {
    // SOLUTION SIMPLE : FormSubmit.co
    // Envoi des données via une simple requête HTTP
    // L'email arrivera sur : sabcompan8306@gmail.com
    const response = await fetch("https://formsubmit.co/ajax/sabcompan8306@gmail.com", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `🔔 Nouveau contact : ${name}`, // Sujet du mail
        nom: name,
        email: email,
        telephone: phone || "Non renseigné",
        message: message,
        _template: "table", // Format propre
        _captcha: "false" // Désactive le captcha de leur côté (on gère le nôtre si besoin)
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur service FormSubmit");
    }

    console.log("📨 Données transmises à FormSubmit pour:", name);

    return { 
      success: true, 
      message: "Message envoyé avec succès ! Sabrina vous recontactera très vite." 
    };

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi:", error);
    return { 
        success: false, 
        message: "Une erreur est survenue. Veuillez réessayer." 
    };
  }
}
