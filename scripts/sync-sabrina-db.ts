import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();
const BACKUP_FILE = './scripts/backup-data.json';

async function backup() {
  console.log('💾 Sauvegarde des données importantes...');

  const backup: any = {};

  // Vérifier si newsletter_subscribers existe
  const nsExists = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') as exists"
  );
  if (nsExists[0].exists) {
    backup.newsletter_subscribers = await prisma.$queryRawUnsafe(`SELECT * FROM "newsletter_subscribers"`);
    console.log(`  → newsletter_subscribers: ${backup.newsletter_subscribers.length} lignes sauvegardées`);
  }

  // Vérifier si admin_logs existe
  const alExists = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_logs') as exists"
  );
  if (alExists[0].exists) {
    backup.admin_logs = await prisma.$queryRawUnsafe(`SELECT * FROM "admin_logs"`);
    console.log(`  → admin_logs: ${backup.admin_logs.length} lignes sauvegardées`);
  }

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
  console.log(`✅ Backup écrit dans ${BACKUP_FILE}\n`);
}

async function restore() {
  if (!fs.existsSync(BACKUP_FILE)) {
    console.log('⚠️ Aucun backup trouvé, skip restore');
    return;
  }

  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));

  if (backup.newsletter_subscribers && backup.newsletter_subscribers.length > 0) {
    console.log('↩️ Restauration newsletter_subscribers...');
    for (const row of backup.newsletter_subscribers) {
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "newsletter_subscribers" (id, email, name, source, is_subscribed, unsubscribe_token, subscribed_at, unsubscribed_at, consent_given, ip_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp, $8::timestamp, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          row.id, row.email, row.name, row.source, row.is_subscribed, row.unsubscribe_token,
          row.subscribed_at, row.unsubscribed_at, row.consent_given, row.ip_address
        );
      } catch (e: any) {
        console.log(`   ⚠️ Erreur ligne ${row.id}: ${e.message}`);
      }
    }
  }

  if (backup.admin_logs && backup.admin_logs.length > 0) {
    console.log('↩️ Restauration admin_logs...');
    for (const row of backup.admin_logs) {
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "admin_logs" (id, user_id, user_email, action, entity_type, entity_id, details, ip_address, user_agent, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamp)
           ON CONFLICT (id) DO NOTHING`,
          row.id, row.user_id, row.user_email, row.action, row.entity_type,
          row.entity_id, row.details, row.ip_address, row.user_agent, row.created_at
        );
      } catch (e: any) {
        console.log(`   ⚠️ Erreur ligne ${row.id}: ${e.message}`);
      }
    }
  }

  console.log('✅ Restore terminé\n');
}

async function main() {
  const action = process.argv[2];

  if (action === 'backup') {
    await backup();
  } else if (action === 'restore') {
    await restore();
  } else {
    console.log('Usage: npx tsx scripts/sync-sabrina-db.ts [backup|restore]');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
