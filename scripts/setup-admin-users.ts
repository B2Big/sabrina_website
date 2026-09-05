/**
 * Script de création des utilisateurs administrateurs
 *
 * Ce script crée les comptes admin dans Supabase Auth et leur attribue des rôles.
 *
 * Prérequis :
 *   - SUPABASE_SERVICE_ROLE_KEY dans .env.local
 *   - ADMIN_SABRINA_PASSWORD et ADMIN_JOHAN_PASSWORD dans .env.local
 *     (mot de passe fourni UNIQUEMENT via variable d'environnement, jamais en dur)
 *
 * Usage : npx tsx scripts/setup-admin-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables manquantes :')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  console.error('\nAssurez-vous que SUPABASE_SERVICE_ROLE_KEY est dans .env.local')
  process.exit(1)
}

// Client admin Supabase (avec service_role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

type AdminUser = {
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'DEVELOPER'
}

// Les mots de passe viennent des variables d'environnement — jamais du code source
const ADMIN_USERS: AdminUser[] = [
  {
    email: 'sabcompan8306@gmail.com',
    password: process.env.ADMIN_SABRINA_PASSWORD || '',
    name: 'Sabrina',
    role: 'ADMIN'
  },
  {
    email: 'johan.dev.pro@gmail.com',
    password: process.env.ADMIN_JOHAN_PASSWORD || '',
    name: 'Developer',
    role: 'DEVELOPER'
  }
]

async function createOrUpdateAdminUser(user: AdminUser) {
  console.log(`\n📝 Traitement de ${user.email}...`)

  // Vérifier que le mot de passe est défini
  if (!user.password || user.password.trim() === '') {
    console.log(`⚠️  Mot de passe vide pour ${user.email}, utilisateur ignoré`)
    return
  }

  try {
    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirmer l'email
      user_metadata: {
        name: user.name
      },
      app_metadata: {
        role: user.role
      }
    })

    if (signUpError) {
      // Si l'utilisateur existe déjà, le mettre à jour
      if (signUpError.message.includes('already registered')) {
        console.log(`ℹ️  Utilisateur existant, mise à jour des métadonnées...`)

        // Récupérer l'utilisateur existant
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = users.users.find(u => u.email === user.email)

        if (existingUser) {
          // Mettre à jour les métadonnées
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              app_metadata: {
                role: user.role
              },
              user_metadata: {
                name: user.name
              }
            }
          )

          if (updateError) {
            console.error(`❌ Erreur lors de la mise à jour:`, updateError.message)
          } else {
            console.log(`✅ Métadonnées mises à jour pour ${user.email}`)
            console.log(`   Rôle: ${user.role}`)
          }
        }
      } else {
        console.error(`❌ Erreur lors de la création:`, signUpError.message)
      }
    } else {
      console.log(`✅ Utilisateur créé avec succès : ${user.email}`)
      console.log(`   ID: ${authData.user.id}`)
      console.log(`   Rôle: ${user.role}`)
      console.log(`   Email confirmé: Oui`)
    }
  } catch (error) {
    console.error(`❌ Erreur inattendue:`, error)
  }
}

async function main() {
  console.log('🚀 Création des utilisateurs administrateurs\n')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Service Role Key:', supabaseServiceKey?.substring(0, 20) + '...')

  // Vérifier que les utilisateurs ont des emails et mots de passe
  const validUsers = ADMIN_USERS.filter(user => {
    const hasEmail = user.email && user.email.trim() !== ''
    const hasPassword = user.password && user.password.trim() !== ''

    if (!hasEmail) {
      console.log(`⚠️  Email manquant pour un utilisateur, ignoré`)
    }

    return hasEmail
  })

  if (validUsers.length === 0) {
    console.error('\n❌ Aucun utilisateur valide à créer.')
    console.error('Veuillez modifier le fichier scripts/setup-admin-users.ts')
    console.error('et remplir les emails et mots de passe dans ADMIN_USERS.')
    process.exit(1)
  }

  // Créer/Mettre à jour chaque utilisateur
  for (const user of validUsers) {
    await createOrUpdateAdminUser(user)
  }

  console.log('\n✨ Script terminé!\n')
  console.log('📌 Prochaines étapes:')
  console.log('   1. Testez la connexion avec ces comptes sur /login')
  console.log('   2. Vérifiez que vous pouvez accéder à /admin')
  console.log('   3. Supprimez ou sécurisez ce script (il contient des mots de passe)')
}

main().catch(console.error)
