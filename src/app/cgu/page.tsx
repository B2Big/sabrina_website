import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au site
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-slate-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Présentation du service</h2>
            <p>
              Le site Sab-Fit (ci-après "le Site"), accessible à l&apos;adresse sab-fit.com, est édité par Sabrina, proposant des services de coaching sportif et de massage.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              L'utilisation du Site implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU).
            </p>

            <h2>3. Services proposés</h2>
            <p>Le Site permet :</p>
            <ul>
              <li>La consultation des services de coaching et massage</li>
              <li>La réservation et le paiement en ligne de prestations</li>
              <li>L'inscription à la newsletter (facultative)</li>
            </ul>

            <h2>4. Commandes et paiement</h2>
            <h3>4.1 Processus de commande</h3>
            <p>
              Les commandes sont effectuées via la plateforme de paiement sécurisée Stripe. Le paiement peut être réalisé par carte bancaire ou PayPal.
            </p>

            <h3>4.2 Confirmation</h3>
            <p>
              Après paiement, vous recevrez un email de confirmation contenant les détails de votre réservation. Sabrina vous contactera sous 24h pour planifier votre séance.
            </p>

            <h3>4.3 Prix</h3>
            <p>
              Les prix sont indiqués en euros TTC. Sabrina se réserve le droit de modifier ses tarifs à tout moment, les prestations étant facturées sur la base des tarifs en vigueur au moment de la commande.
            </p>

            <h2>5. Droit de rétractation</h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les prestations de services pleinement exécutées avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur.
            </p>
            <p>
              Pour les prestations non commencées, vous disposez d'un délai de 14 jours à compter de la commande pour exercer votre droit de rétractation. Contactez-nous par email pour toute demande.
            </p>

            <h2>6. Données personnelles et RGPD</h2>
            <h3>6.1 Données collectées</h3>
            <p>Lors de votre commande, nous collectons :</p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Données de paiement (traitées par Stripe, non stockées sur nos serveurs)</li>
            </ul>

            <h3>6.2 Finalité</h3>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Traiter vos commandes</li>
              <li>Vous contacter concernant vos réservations</li>
              <li>Vous envoyer notre newsletter (si vous avez consenti)</li>
            </ul>

            <h3>6.3 Conservation</h3>
            <p>
              Vos données sont conservées pendant la durée nécessaire aux fins pour lesquelles elles ont été collectées, et conformément aux obligations légales.
            </p>

            <h3>6.4 Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : supprimer vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <strong>contact@sab-fit.com</strong>
            </p>

            <h2>7. Newsletter</h2>
            <p>
              L'inscription à la newsletter est facultative et proposée lors du paiement. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque email ou en nous contactant.
            </p>

            <h2>8. Cookies</h2>
            <p>Le Site utilise des cookies pour :</p>
            <ul>
              <li>Assurer le fonctionnement technique (authentification admin)</li>
              <li>Gérer votre panier d'achat</li>
              <li>Analyser l'audience (si analytics activé)</li>
            </ul>
            <p>Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut limiter certaines fonctionnalités.</p>

            <h2>9. Propriété intellectuelle</h2>
            <p>
              Tous les éléments du Site (textes, images, logos, vidéos) sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite.
            </p>

            <h2>10. Responsabilité</h2>
            <p>
              Sabrina s'efforce d'assurer l'exactitude des informations diffusées sur le Site, mais ne peut garantir l'absence d'erreurs. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations.
            </p>

            <h2>11. Réclamations</h2>
            <p>
              Pour toute réclamation, contactez-nous à : <strong>contact@sab-fit.com</strong>
            </p>
            <p>
              En cas de litige non résolu, vous pouvez recourir à la médiation de la consommation.
            </p>

            <h2>12. Loi applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence des tribunaux français.
            </p>

            <hr className="my-8" />

            <h2>Contact</h2>
            <p>
              <strong>Sab-Fit</strong><br />
              Email : contact@sab-fit.com<br />
              Site : https://www.sab-fit.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
