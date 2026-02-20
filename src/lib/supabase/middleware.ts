import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { hasAdminAccess, getUserRole } from '@/lib/auth/roles'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({
              name,
              value,
              ...options,
            })
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({
              name,
              value,
              ...options,
            })
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protection de la route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. Vérifier si l'utilisateur est connecté
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Vérifier si l'utilisateur a un rôle admin (ADMIN ou DEVELOPER)
    if (!hasAdminAccess(user)) {
      console.warn(`Tentative d'accès non autorisée à /admin`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // L'utilisateur a accès, afficher son rôle dans les logs
    const role = getUserRole(user)
    console.log(`Accès /admin autorisé`)
  }

  // Rediriger les utilisateurs connectés de /login vers /admin
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    if (hasAdminAccess(user)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Si connecté mais pas admin, rediriger vers l'accueil
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}
