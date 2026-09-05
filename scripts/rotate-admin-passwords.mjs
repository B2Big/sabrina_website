/**
 * Script de rotation des mots de passe admin (usage unique, à supprimer après)
 * Met à jour les mots de passe des comptes admin Supabase avec des valeurs aléatoires fortes.
 *
 * Usage : node scripts/rotate-admin-passwords.mjs
 * Prérequis : NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY dans .env.local
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Charger .env.local (sans jamais l'afficher)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Comptes admin à faire tourner (emails uniquement — pas de secrets ici)
const ADMIN_EMAILS = [
  { email: 'sabcompan8306@gmail.com', name: 'Sabrina', role: 'ADMIN' },
  { email: 'johan.dev.pro@gmail.com', name: 'Developer', role: 'DEVELOPER' },
];

// Génère un mot de passe fort et lisible (sans caractères ambigus)
function generateStrongPassword(length = 20) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*+-_?';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  // Garantir au moins un symbole, un chiffre, une majuscule
  const sym = '!@#$%&*+-_?'[crypto.randomBytes(1)[0] % 11];
  const digit = String(crypto.randomBytes(1)[0] % 10);
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'[crypto.randomBytes(1)[0] % 24];
  out = out.slice(3) + sym + digit + upper;
  return out;
}

async function main() {
  console.log('🔐 Rotation des mots de passe admin\n');

  // Lister les utilisateurs existants
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('❌ Impossible de lister les utilisateurs :', listError.message);
    process.exit(1);
  }

  const results = [];

  for (const admin of ADMIN_EMAILS) {
    const existing = usersData.users.find((u) => u.email === admin.email);
    if (!existing) {
      console.log(`⚠️  Compte introuvable pour ${admin.email} — ignoré`);
      results.push({ email: admin.email, status: 'introuvable' });
      continue;
    }

    const newPassword = generateStrongPassword(20);

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: newPassword,
      email_confirm: true,
      app_metadata: { role: admin.role },
      user_metadata: { name: admin.name },
    });

    if (updateError) {
      console.error(`❌ Échec rotation pour ${admin.email} :`, updateError.message);
      results.push({ email: admin.email, status: 'echec', error: updateError.message });
    } else {
      console.log(`✅ Mot de passe changé pour ${admin.email} (${admin.name} / ${admin.role})`);
      results.push({ email: admin.email, status: 'ok', password: newPassword });
    }
  }

  console.log('\n============================================');
  console.log('📋 NOUVEAUX MOTS DE PASSE — À NOTER MAINTENANT');
  console.log('============================================');
  for (const r of results) {
    if (r.status === 'ok') {
      console.log(`\n${r.email}`);
      console.log(`  Mot de passe : ${r.password}`);
    }
  }
  console.log('\n⚠️  Notez ces mots de passe dans votre gestionnaire, puis SUPPRIMEZ ce script.');
  console.log('============================================');

  // Sauvegarde locale hors git (fichier .gitignore) pour ne pas perdre les valeurs
  const outFile = path.resolve(process.cwd(), '.rotated-passwords.txt');
  const lines = results
    .filter((r) => r.status === 'ok')
    .map((r) => `${r.email}\t${r.password}`)
    .join('\n');
  fs.writeFileSync(outFile, lines + '\n', { mode: 0o600 });
  console.log(`💾 Copie écrite dans ${outFile} (permissions 600, gitignoré) — à supprimer après sauvegarde.\n`);
}

main().catch((e) => {
  console.error('❌ Erreur inattendue :', e);
  process.exit(1);
});
