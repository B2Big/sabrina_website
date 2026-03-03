import { Resend } from 'resend';

// Initialiser Resend avec la clé API
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email de Sabrina (destinataire des notifications)
export const SABRINA_EMAIL = 'sabcompan8306@gmail.com';

// Email d'expédition
// Le domaine sab-fit.com est maintenant vérifié sur Resend
export const FROM_EMAIL = 'contact@sab-fit.com';

// ============================================
// UTILITAIRES
// ============================================

// Échapper les caractères HTML pour éviter les injections XSS dans les emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Formatage des prix
function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
}

// ============================================
// FLUX 1: PAIEMENT SUR PLACE
// ============================================

/**
 * Email au CLIENT - Confirmation réservation "Paiement sur place"
 * Thème: 🟠 Orange (attention)
 */
export async function sendConfirmationToCustomerSurPlace({
  customerName,
  customerEmail,
  reservationId,
  services,
  total,
  requestedDate,
}: {
  customerName: string;
  customerEmail: string;
  reservationId: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  requestedDate?: string | Date | null;
}) {
  console.log("📧 [SUR PLACE] Email confirmation client:", customerEmail);
  
  const safeName = escapeHtml(customerName);
  const safeTotal = formatPrice(total);
  const dateStr = requestedDate 
    ? new Date(requestedDate).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #f59e0b;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong style="color: #1e293b;">${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #1e293b;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Orange -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">⏳ Réservation Enregistrée</h1>
            <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 14px;">Référence: ${reservationId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div style="padding: 30px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${safeName}</strong>,
            </p>

            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Votre réservation a bien été enregistrée. Voici les détails :
            </p>

            <!-- Détails Service -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📋 Prestations réservées :</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total estimé :</span>
                <span style="font-size: 20px; font-weight: bold; color: #1e293b;">${safeTotal} €</span>
              </div>
            </div>

            <!-- ⚠️ INFO IMPORTANTE - Paiement sur place -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">💳 Paiement sur place</h3>
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                Le règlement de <strong>${safeTotal} €</strong> se fera <strong>directement lors de votre rendez-vous</strong>.
              </p>
              <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
                ✅ Moyens acceptés : Espèces, Carte bancaire, PayPal
              </p>
            </div>

            ${dateStr ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
              <strong style="color: #0c4a6e;">📅 Date souhaitée :</strong>
              <span style="color: #0c4a6e; margin-left: 10px;">${dateStr}</span>
            </div>
            ` : ''}

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 25px;">
              <strong>Sabrina</strong> vous contactera sous <strong>24h</strong> pour confirmer votre rendez-vous.
            </p>

            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                💪 Merci de votre confiance !
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit - Coaching & Bien-être<br>
              <a href="https://www.sab-fit.com" style="color: #3b82f6; text-decoration: none;">www.sab-fit.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `⏳ Réservation enregistrée - Réf: ${reservationId.slice(0, 8).toUpperCase()}`,
      html,
    });
    console.log("✅ Email client [SUR PLACE] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email client [SUR PLACE]:", error);
    throw error;
  }
}

/**
 * Email au PROPRIÉTAIRE - Notification "Paiement sur place"
 * Thème: 🟠 Orange (à percevoir)
 */
export async function sendNotificationToSabrinaSurPlace({
  reservationId,
  customerName,
  customerEmail,
  customerPhone,
  services,
  total,
  message,
  requestedDate,
}: {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  message?: string | null;
  requestedDate?: string | Date | null;
}) {
  console.log("📧 [SUR PLACE] Email notification Sabrina:", SABRINA_EMAIL);
  
  const safeName = escapeHtml(customerName);
  const safeEmail = escapeHtml(customerEmail);
  const safePhone = escapeHtml(customerPhone);
  const safeMessage = message ? escapeHtml(message) : '';
  const safeTotal = formatPrice(total);
  const dateStr = requestedDate 
    ? new Date(requestedDate).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #f59e0b;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong>${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #1e293b;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Orange -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">🔔 Nouvelle Réservation</h1>
            <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 14px;">Paiement sur place</p>
          </div>

          <div style="padding: 30px;">
            
            <!-- ⚠️ ALERTE PAIEMENT -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">💳 Mode de règlement choisi</h3>
              <p style="margin: 0; color: #92400e; font-size: 15px; font-weight: bold;">
                Paiement direct lors du rendez-vous
              </p>
              <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">
                À percevoir: <strong>${safeTotal} €</strong>
              </p>
            </div>

            <!-- Infos Client -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">👤 Informations Client</h3>
              
              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Nom</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${safeName}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Email</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>
                </div>
              </div>

              <div style="margin-bottom: 0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Téléphone</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="tel:${safePhone}" style="color: #3b82f6; text-decoration: none;">📞 ${safePhone}</a>
                </div>
              </div>
            </div>

            <!-- Infos Service -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📋 Prestations</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total à percevoir:</span>
                <span style="font-size: 24px; font-weight: bold; color: #f59e0b;">${safeTotal} €</span>
              </div>
            </div>

            ${dateStr ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin-bottom: 20px;">
              <strong style="color: #0c4a6e;">📅 Date souhaitée par le client :</strong>
              <span style="color: #0c4a6e; margin-left: 10px;">${dateStr}</span>
            </div>
            ` : ''}

            ${safeMessage ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">💬 Message du client</h3>
              <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            ` : ''}

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${safeEmail}?subject=Re: Votre réservation Sab-Fit - Réf ${reservationId.slice(0, 8)}" 
                 style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📧 Répondre au client
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit Dashboard | Réf: ${reservationId}<br>
              <a href="https://www.sab-fit.com/admin" style="color: #3b82f6; text-decoration: none;">Gérer les réservations</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: SABRINA_EMAIL,
      subject: `🔔 Nouvelle réservation - Paiement sur place - ${safeName} - ${safeTotal}€`,
      html,
    });
    console.log("✅ Email Sabrina [SUR PLACE] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email Sabrina [SUR PLACE]:", error);
    throw error;
  }
}

// ============================================
// FLUX 2: PAIEMENT EN LIGNE (STRIPE)
// ============================================

/**
 * Email au CLIENT - Confirmation "Payé" (Bundle Reçu + Confirmation)
 * Thème: 🟢 Vert (succès)
 */
export async function sendConfirmationToCustomerPaye({
  customerName,
  customerEmail,
  reservationId,
  services,
  total,
  stripeReceiptUrl,
  paidAt,
}: {
  customerName: string;
  customerEmail: string;
  reservationId: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  stripeReceiptUrl: string | null;
  paidAt: Date;
}) {
  console.log("📧 [PAYÉ] Email confirmation client:", customerEmail);
  
  const safeName = escapeHtml(customerName);
  const safeTotal = formatPrice(total);
  const paidDateStr = new Date(paidAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #10b981;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong style="color: #1e293b;">${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #10b981;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Vert -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">✅ Réservation Confirmée & Payée</h1>
            <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 14px;">Référence: ${reservationId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div style="padding: 30px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${safeName}</strong>,
            </p>

            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Votre paiement a été reçu et votre réservation est confirmée ! 🎉
            </p>

            <!-- 🧾 REÇU STRIPE -->
            <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">🧾</div>
              <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">Votre Reçu</h3>
              <p style="margin: 0 0 15px 0; color: #065f46; font-size: 14px;">
                Montant payé: <strong style="font-size: 18px;">${safeTotal} €</strong><br>
                Date: ${paidDateStr}
              </p>
              ${stripeReceiptUrl ? `
              <a href="${stripeReceiptUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                📄 Télécharger le reçu Stripe
              </a>
              ` : '<p style="color: #065f46; font-size: 13px;">Reçu disponible dans votre compte Stripe</p>'}
            </div>

            <!-- Détails Réservation -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">✅ Détails de votre réservation</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Payé:</span>
                <span style="font-size: 22px; font-weight: bold; color: #10b981;">${safeTotal} € ✅</span>
              </div>
            </div>

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 25px;">
              <strong>Sabrina</strong> vous contactera sous <strong>24h</strong> pour organiser votre rendez-vous.
            </p>

            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                💪 Merci de votre confiance ! À très bientôt !
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit - Coaching & Bien-être<br>
              <a href="https://www.sab-fit.com" style="color: #3b82f6; text-decoration: none;">www.sab-fit.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `✅ Réservation confirmée & payée - Réf: ${reservationId.slice(0, 8).toUpperCase()}`,
      html,
    });
    console.log("✅ Email client [PAYÉ] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email client [PAYÉ]:", error);
    throw error;
  }
}

/**
 * Email au PROPRIÉTAIRE - Notification "Réservation Payée"
 * Thème: 🟢 Vert (paiement reçu)
 */
export async function sendNotificationToSabrinaPaye({
  reservationId,
  customerName,
  customerEmail,
  customerPhone,
  services,
  total,
  message,
  stripePaymentId,
  paidAt,
}: {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  message?: string | null;
  stripePaymentId: string;
  paidAt: Date;
}) {
  console.log("📧 [PAYÉ] Email notification Sabrina:", SABRINA_EMAIL);
  
  const safeName = escapeHtml(customerName);
  const safeEmail = escapeHtml(customerEmail);
  const safePhone = escapeHtml(customerPhone);
  const safeMessage = message ? escapeHtml(message) : '';
  const safeTotal = formatPrice(total);
  const paidDateStr = new Date(paidAt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #10b981;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong>${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #10b981;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Vert -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">✅ Réservation Confirmée & Payée</h1>
            <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 14px;">Paiement en ligne reçu</p>
          </div>

          <div style="padding: 30px;">
            
            <!-- ✅ ALERTE PAIEMENT REÇU -->
            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">✅ Paiement en ligne reçu (Stripe)</h3>
              <p style="margin: 5px 0; color: #065f46; font-size: 15px;">
                <strong>Montant:</strong> ${safeTotal} €
              </p>
              <p style="margin: 5px 0; color: #065f46; font-size: 14px;">
                <strong>Transaction:</strong> <code style="background: rgba(255,255,255,0.5); padding: 2px 6px; border-radius: 4px;">${stripePaymentId}</code>
              </p>
              <p style="margin: 5px 0 0 0; color: #065f46; font-size: 14px;">
                <strong>Date:</strong> ${paidDateStr}
              </p>
            </div>

            <!-- Infos Client -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">👤 Informations Client</h3>
              
              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Nom</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${safeName}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Email</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>
                </div>
              </div>

              <div style="margin-bottom: 0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Téléphone</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="tel:${safePhone}" style="color: #3b82f6; text-decoration: none;">📞 ${safePhone}</a>
                </div>
              </div>
            </div>

            <!-- Infos Service -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📋 Prestations</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Payé:</span>
                <span style="font-size: 24px; font-weight: bold; color: #10b981;">${safeTotal} € ✅</span>
              </div>
            </div>

            ${safeMessage ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">💬 Message du client</h3>
              <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            ` : ''}

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${safeEmail}?subject=Re: Votre réservation confirmée Sab-Fit - Réf ${reservationId.slice(0, 8)}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                📧 Contacter le client
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit Dashboard | Réf: ${reservationId}<br>
              <a href="https://www.sab-fit.com/admin" style="color: #3b82f6; text-decoration: none;">Gérer les réservations</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: SABRINA_EMAIL,
      subject: `✅ Réservation PAYÉE - ${safeName} - ${safeTotal}€ ✅`,
      html,
    });
    console.log("✅ Email Sabrina [PAYÉ] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email Sabrina [PAYÉ]:", error);
    throw error;
  }
}

// ============================================
// FLUX 3: PAIEMENT STRIPE (En attente)
// Thème: 🔵 Bleu (Stripe)
// ============================================

/**
 * Email au CLIENT - Confirmation réservation "Paiement Stripe en attente"
 * Thème: 🔵 Bleu (Stripe) - Différencié du sur place
 */
export async function sendConfirmationToCustomerStripePending({
  customerName,
  customerEmail,
  reservationId,
  services,
  total,
  requestedDate,
}: {
  customerName: string;
  customerEmail: string;
  reservationId: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  requestedDate?: string | Date | null;
}) {
  console.log("📧 [STRIPE PENDING] Email confirmation client:", customerEmail);
  
  const safeName = escapeHtml(customerName);
  const safeTotal = formatPrice(total);
  const dateStr = requestedDate 
    ? new Date(requestedDate).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #3B82F6;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #3B82F6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong style="color: #1e293b;">${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #1e293b;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Bleu Stripe -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">💳 Réservation Stripe</h1>
            <p style="margin: 10px 0 0 0; color: #DBEAFE; font-size: 14px;">Référence: ${reservationId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div style="padding: 30px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${safeName}</strong>,
            </p>

            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Votre réservation a bien été enregistrée. <strong>Il ne vous reste plus qu'à finaliser le paiement sécurisé via Stripe.</strong>
            </p>

            <!-- Détails Service -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📋 Prestations réservées :</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total :</span>
                <span style="font-size: 20px; font-weight: bold; color: #1e293b;">${safeTotal} €</span>
              </div>
            </div>

            <!-- 🔵 INFO IMPORTANTE - Paiement Stripe -->
            <div style="background: #DBEAFE; border: 2px solid #3B82F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1E40AF; font-size: 18px;">💳 Finalisez votre paiement</h3>
              <p style="margin: 0; color: #1E40AF; font-size: 15px; line-height: 1.5;">
                Vous allez être redirigé vers <strong>Stripe</strong> pour effectuer le paiement sécurisé de <strong>${safeTotal} €</strong>.
              </p>
              <p style="margin: 10px 0 0 0; color: #1E40AF; font-size: 14px;">
                ✅ Paiement sécurisé par carte bancaire ou PayPal
              </p>
            </div>

            ${dateStr ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
              <strong style="color: #0c4a6e;">📅 Date souhaitée :</strong>
              <span style="color: #0c4a6e; margin-left: 10px;">${dateStr}</span>
            </div>
            ` : ''}

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 25px;">
              Une fois le paiement confirmé, vous recevrez un <strong>email de confirmation avec votre reçu</strong>.
            </p>

            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                💪 Merci de votre confiance !
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit - Coaching & Bien-être<br>
              <a href="https://www.sab-fit.com" style="color: #3b82f6; text-decoration: none;">www.sab-fit.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `💳 Finalisez votre paiement - Réf: ${reservationId.slice(0, 8).toUpperCase()}`,
      html,
    });
    console.log("✅ Email client [STRIPE PENDING] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email client [STRIPE PENDING]:", error);
    throw error;
  }
}

/**
 * Email au PROPRIÉTAIRE - Notification "Nouvelle réservation Stripe"
 * Thème: 🔵 Bleu (Stripe)
 */
export async function sendNotificationToSabrinaStripePending({
  reservationId,
  customerName,
  customerEmail,
  customerPhone,
  services,
  total,
  message,
  requestedDate,
}: {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: Array<{ title: string; price: string; quantity: number }>;
  total: string | number;
  message?: string | null;
  requestedDate?: string | Date | null;
}) {
  console.log("📧 [STRIPE PENDING] Email notification Sabrina:", SABRINA_EMAIL);
  
  const safeName = escapeHtml(customerName);
  const safeEmail = escapeHtml(customerEmail);
  const safePhone = escapeHtml(customerPhone);
  const safeMessage = message ? escapeHtml(message) : '';
  const safeTotal = formatPrice(total);
  const dateStr = requestedDate 
    ? new Date(requestedDate).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const servicesHTML = services.map(s => `
    <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #3B82F6;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #3B82F6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">${s.quantity}x</span>
          <strong>${escapeHtml(s.title)}</strong>
        </div>
        <span style="font-weight: bold; color: #1e293b;">${formatPrice(s.price)} €</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Bleu Stripe -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">💳 Nouvelle Réservation Stripe</h1>
            <p style="margin: 10px 0 0 0; color: #DBEAFE; font-size: 14px;">En attente de paiement</p>
          </div>

          <div style="padding: 30px;">
            
            <!-- 🔵 ALERTE PAIEMENT EN ATTENTE -->
            <div style="background: #DBEAFE; border: 2px solid #3B82F6; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1E40AF; font-size: 18px;">⏳ Paiement Stripe en cours</h3>
              <p style="margin: 0; color: #1E40AF; font-size: 15px;">
                Le client a choisi le paiement en ligne. <strong>La réservation sera confirmée après validation du paiement.</strong>
              </p>
              <p style="margin: 10px 0 0 0; color: #1E40AF; font-size: 14px;">
                Montant attendu: <strong>${safeTotal} €</strong>
              </p>
            </div>

            <!-- Infos Client -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">👤 Informations Client</h3>
              
              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Nom</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${safeName}</div>
              </div>

              <div style="margin-bottom: 12px;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Email</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>
                </div>
              </div>

              <div style="margin-bottom: 0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Téléphone</strong>
                <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                  <a href="tel:${safePhone}" style="color: #3b82f6; text-decoration: none;">📞 ${safePhone}</a>
                </div>
              </div>
            </div>

            <!-- Infos Service -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📋 Prestations</h3>
              ${servicesHTML}
              <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px; text-align: right;">
                <span style="font-size: 14px; color: #64748b; margin-right: 10px;">Total à percevoir:</span>
                <span style="font-size: 24px; font-weight: bold; color: #3B82F6;">${safeTotal} €</span>
              </div>
            </div>

            ${dateStr ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin-bottom: 20px;">
              <strong style="color: #0c4a6e;">📅 Date souhaitée par le client :</strong>
              <span style="color: #0c4a6e; margin-left: 10px;">${dateStr}</span>
            </div>
            ` : ''}

            ${safeMessage ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">💬 Message du client</h3>
              <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            ` : ''}

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${safeEmail}?subject=Re: Votre réservation Sab-Fit - Réf ${reservationId.slice(0, 8)}" 
                 style="display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📧 Contacter le client
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Sab-Fit Dashboard | Réf: ${reservationId}<br>
              <a href="https://www.sab-fit.com/admin" style="color: #3b82f6; text-decoration: none;">Gérer les réservations</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: SABRINA_EMAIL,
      subject: `💳 Réservation Stripe - ${safeName} - ${safeTotal}€ (en attente)`,
      html,
    });
    console.log("✅ Email Sabrina [STRIPE PENDING] envoyé:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur email Sabrina [STRIPE PENDING]:", error);
    throw error;
  }
}

// ============================================
// FONCTIONS LEGACY (pour compatibilité)
// ============================================

/**
 * @deprecated Utiliser sendNotificationToSabrinaSurPlace ou sendNotificationToSabrinaPaye
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
  // Redirection vers la nouvelle fonction pour paiement sur place
  return sendNotificationToSabrinaSurPlace({
    reservationId: 'legacy-' + Date.now(),
    customerName,
    customerEmail,
    customerPhone,
    services: cartItems || [],
    total: total || '0',
    message,
  });
}

/**
 * @deprecated Utiliser sendConfirmationToCustomerSurPlace ou sendConfirmationToCustomerPaye
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
  // Redirection vers la nouvelle fonction pour paiement sur place
  return sendConfirmationToCustomerSurPlace({
    customerName,
    customerEmail,
    reservationId: 'legacy-' + Date.now(),
    services: cartItems || [],
    total: total || '0',
  });
}
