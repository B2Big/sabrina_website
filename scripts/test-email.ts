#!/usr/bin/env tsx
/**
 * Script de test pour vérifier la configuration Resend
 * Usage: npx tsx scripts/test-email.ts
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY non définie');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Test de configuration Resend...\n');
  
  // Test 1: Vérifier la clé API
  console.log('1️⃣ Vérification de la clé API...');
  try {
    const domains = await resend.domains.list();
    console.log('✅ Clé API valide');
    console.log('📊 Domaines configurés:', domains.data?.map(d => d.name).join(', ') || 'Aucun');
  } catch (error) {
    console.error('❌ Clé API invalide:', error);
    return;
  }
  
  console.log('\n2️⃣ Test d\'envoi d\'email...');
  
  // Test 2: Envoyer un email de test
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Utilise l'email de test Resend
      to: 'sabcompan8306@gmail.com',  // Email de Sabrina
      subject: '🧪 Test - Configuration Resend',
      html: `
        <h1>Test de configuration Resend</h1>
        <p>Si vous recevez cet email, la configuration Resend fonctionne !</p>
        <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
      `,
    });
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📧 ID:', result.data?.id);
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Vérifiez votre boîte mail (sabcompan8306@gmail.com)');
    console.log('2. Vérifiez aussi les SPAM');
    console.log('3. Si OK: configurez le domaine sab-fit.com sur Resend');
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
  }
}

testEmail();
