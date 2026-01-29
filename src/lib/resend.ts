import { Resend } from 'resend';

// Initialiser Resend avec la clé API
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email de Sabrina (destinataire des notifications)
// TEMPORAIRE: Email de test pour faciliter les tests
export const SABRINA_EMAIL = 'syups4@gmail.com';

// Email d'expédition (doit être vérifié dans Resend)
// Par défaut, Resend fournit onboarding@resend.dev pour les tests
export const FROM_EMAIL = 'onboarding@resend.dev';

/**
 * Envoie un email de notification à Sabrina pour une nouvelle réservation
 */
export async function sendReservationToSabrina({
  customerName,
  customerEmail,
  customerPhone,
  message,
  cartItems,
  total,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  cartItems?: Array<{ title: string; price: string; quantity: number }>;
  total?: string;
}) {
  console.log("🔔 sendReservationToSabrina appelée");
  console.log("   → Destinataire:", SABRINA_EMAIL);
  console.log("   → From:", FROM_EMAIL);
  console.log("   → Client:", customerName, "-", customerEmail);

  const cartHTML = cartItems && cartItems.length > 0 ? `
    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #334155; font-size: 16px; font-weight: bold;">🛒 Prestations réservées :</h3>
      ${cartItems.map(item => `
        <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="background: #1e293b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${item.quantity}x</span>
            <strong>${item.title}</strong>
          </div>
          <span style="font-weight: bold; color: #1e293b;">${item.price}</span>
        </div>
      `).join('')}
      <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
        <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total estimé :</span>
        <span style="font-size: 20px; font-weight: bold; color: #1e293b;">${total} €</span>
      </div>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">🔔 Nouvelle Réservation</h1>
            <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 14px;">Un client souhaite prendre rendez-vous</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">

            <!-- Client Info -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: bold;">👤 Informations Client</h2>

              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nom & Prénom</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600; margin-top: 4px;">${customerName}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600; margin-top: 4px;">
                  <a href="tel:${customerPhone}" style="color: #3b82f6; text-decoration: none;">📞 ${customerPhone}</a>
                </div>
              </div>

              <div style="margin-bottom: 0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600; margin-top: 4px;">
                  <a href="mailto:${customerEmail}" style="color: #3b82f6; text-decoration: none;">${customerEmail}</a>
                </div>
              </div>
            </div>

            ${cartHTML}

            <!-- Message -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 16px; font-weight: bold;">💬 Message du client :</h3>
              <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${customerEmail}?subject=Re: Votre réservation Sab-Fit"
                 style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📧 Répondre au client
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit - Dashboard Admin<br>
              <a href="https://www.sab-fit.com/admin" style="color: #3b82f6; text-decoration: none;">Gérer les réservations</a>
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: SABRINA_EMAIL,
    subject: `🔔 Nouvelle réservation : ${customerName}`,
    html,
  });

  console.log("📬 Résultat Resend (Sabrina):", JSON.stringify(result));

  return result;
}

/**
 * Envoie un email de confirmation au client
 */
export async function sendConfirmationToCustomer({
  customerName,
  customerEmail,
  message,
  cartItems,
  total,
}: {
  customerName: string;
  customerEmail: string;
  message: string;
  cartItems?: Array<{ title: string; price: string; quantity: number }>;
  total?: string;
}) {
  console.log("✉️ sendConfirmationToCustomer appelée");
  console.log("   → Destinataire:", customerEmail);
  console.log("   → From:", FROM_EMAIL);

  const cartHTML = cartItems && cartItems.length > 0 ? `
    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #334155; font-size: 16px; font-weight: bold;">📋 Récapitulatif de votre sélection :</h3>
      ${cartItems.map(item => `
        <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${item.quantity}x</span>
            <strong>${item.title}</strong>
          </div>
          <span style="font-weight: bold; color: #1e293b;">${item.price}</span>
        </div>
      `).join('')}
      <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
        <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total estimé :</span>
        <span style="font-size: 20px; font-weight: bold; color: #3b82f6;">${total} €</span>
      </div>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">✅ Réservation Confirmée</h1>
            <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 14px;">Votre demande a bien été envoyée</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">

            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              Bonjour <strong>${customerName}</strong>,
            </p>

            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              Merci pour votre réservation chez <strong>Sab-Fit</strong> ! 🎉
            </p>

            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              J'ai bien reçu votre demande et je vous recontacterai très rapidement (sous 24h) pour confirmer vos disponibilités et finaliser votre rendez-vous.
            </p>

            ${cartHTML}

            <!-- Message Recap -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 14px; font-weight: bold;">📝 Votre message :</h3>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
            </div>

            <!-- Contact Info -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); padding: 20px; border-radius: 10px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px;">
                <strong>Une question ?</strong>
              </p>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                📧 <a href="mailto:sabcompan8306@gmail.com" style="color: #3b82f6; text-decoration: none;">sabcompan8306@gmail.com</a>
              </p>
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 30px; text-align: center;">
              À très bientôt,<br>
              <strong style="color: #1e293b;">Sabrina</strong> 💪✨
            </p>

          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit - Coaching & Bien-être<br>
              Vous recevez cet email suite à votre demande de réservation
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: '✅ Réservation confirmée - Sab-Fit',
    html,
  });

  console.log("📬 Résultat Resend (Client):", JSON.stringify(result));

  return result;
}
