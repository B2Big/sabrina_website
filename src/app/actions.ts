'use server'

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export async function sendContactEmail(formData: FormData) {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

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

  // TODO: Integrate actual Email Provider (Resend, SendGrid, etc.)
  // TODO: Integrate SMS Provider (Twilio, Vonage, etc.)
  
  console.log("📨 Email simulation:", result.data);
  console.log("📱 SMS simulation: New message from " + result.data.name);

  return { 
    success: true, 
    message: "Message envoyé avec succès ! Sabrina vous recontactera très vite." 
  };
}