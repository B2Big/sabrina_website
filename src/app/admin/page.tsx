import { getServices, getPromotions } from './actions'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { hasAdminAccess } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // 🔒 Vérification d'authentification côté serveur
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rediriger vers /login si pas connecté
  if (!user) {
    redirect('/login')
  }

  // Rediriger vers / si pas de rôle admin
  if (!hasAdminAccess(user)) {
    redirect('/')
  }

  // Utilisateur authentifié et autorisé
  const services = await getServices()
  const promotions = await getPromotions()

  return <AdminDashboard services={services} promotions={promotions} />
}