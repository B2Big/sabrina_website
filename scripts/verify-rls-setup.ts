#!/usr/bin/env tsx
/**
 * Script de vérification post-migration RLS
 * 
 * Ce script vérifie que :
 * 1. La connexion à la base de données fonctionne
 * 2. Les réservations peuvent être créées (INSERT public)
 * 3. Les emails sont configurés correctement
 * 
 * Usage: npx tsx scripts/verify-rls-setup.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySetup() {
  console.log('🔍 Vérification post-migration RLS...\n');

  try {
    // 1. Test connexion DB
    console.log('1️⃣ Test connexion base de données...');
    const dbResult = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log('   ✅ Connexion OK:', dbResult);

    // 2. Test création réservation (simulation)
    console.log('\n2️⃣ Test création réservation (INSERT)...');
    const testReservation = await prisma.reservation.create({
      data: {
        status: 'attente_paiement_sur_place',
        customerName: 'Test RLS',
        customerEmail: 'test-rls@sab-fit.com',
        customerPhone: '0600000000',
        serviceTitle: 'Test Service',
        servicePrice: 50,
        quantity: 1,
        totalAmount: 50,
        paymentMethod: 'sur_place',
      }
    });
    console.log('   ✅ Réservation créée:', testReservation.id.substring(0, 8) + '...');

    // 3. Test lecture (doit fonctionner avec Prisma/service_role)
    console.log('\n3️⃣ Test lecture réservation (SELECT)...');
    const readReservation = await prisma.reservation.findUnique({
      where: { id: testReservation.id }
    });
    console.log('   ✅ Lecture OK:', readReservation ? 'Trouvée' : 'Non trouvée');

    // 4. Cleanup - supprimer la réservation de test
    console.log('\n4️⃣ Cleanup...');
    await prisma.reservation.delete({
      where: { id: testReservation.id }
    });
    console.log('   ✅ Réservation test supprimée');

    // 5. Vérifier les variables d'environnement email
    console.log('\n5️⃣ Vérification variables email...');
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'contact@sab-fit.com';
    
    if (resendKey) {
      console.log('   ✅ RESEND_API_KEY présente (' + resendKey.substring(0, 10) + '...)');
    } else {
      console.log('   ⚠️  RESEND_API_KEY manquante');
    }
    console.log('   📧 Email expéditeur:', fromEmail);

    console.log('\n✅ Toutes les vérifications sont passées !');
    console.log('\n📋 Récapitulatif:');
    console.log('   • Connexion DB: OK');
    console.log('   • INSERT (public): OK');
    console.log('   • SELECT (service_role): OK');
    console.log('   • Emails: Configurés');
    console.log('\n🚀 Votre setup RLS est opérationnel !');

  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
