import { getServices, getPromotions } from './actions'
import { getNewsletterSubscribers, getNewsletterStats } from './newsletter-actions'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { hasAdminAccess } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // 🔒 Vérification d'authentification côté serveur
  const user = await getCurrentUser()

  // Rediriger vers /login si pas connecté
  if (!user) {
    redirect('/login')
  }

  // Rediriger vers /forbidden si pas de rôle admin
  if (!hasAdminAccess(user.raw)) {
    redirect('/forbidden')
  }

  // Utilisateur authentifié et autorisé - Charger les données
  const services = await getServices()
  const promotions = await getPromotions()
  const newsletterSubscribers = await getNewsletterSubscribers()
  const newsletterStats = await getNewsletterStats()

  return (
    <AdminDashboard
      services={services}
      promotions={promotions}
      newsletterSubscribers={newsletterSubscribers}
      newsletterStats={newsletterStats}
    />
  )
}