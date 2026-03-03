-- =============================================================================
-- MIGRATION : Durcissement RLS - Table reservations
-- Objectif: Remplacer WITH CHECK (true) par une contrainte réelle
-- Supprime l'alerte "RLS Policy Always True" de Supabase
-- =============================================================================

-- 1. Supprimer l'ancienne politique trop permissive
DROP POLICY IF EXISTS "Allow public insert on reservations" ON "reservations";

-- 2. Nouvelle politique avec vérification réelle
-- Le public peut insérer, mais avec des contraintes minimales de validation
CREATE POLICY "Allow public insert on reservations" 
ON "reservations" 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- L'email client doit être présent et valide
  customer_email IS NOT NULL 
  AND customer_email <> ''
  AND customer_email LIKE '%@%'
  -- Le nom doit être présent
  AND customer_name IS NOT NULL 
  AND customer_name <> ''
  -- Le téléphone doit être présent
  AND customer_phone IS NOT NULL 
  AND customer_phone <> ''
);

-- =============================================================================
-- VÉRIFICATION APRÈS MIGRATION:
-- =============================================================================
-- Vérifier la politique:
-- SELECT policyname, qual FROM pg_policies WHERE tablename = 'reservations' AND cmd = 'INSERT';
--
-- Tester une insertion valide (doit fonctionner):
-- INSERT INTO reservations (status, customer_name, customer_email, customer_phone, service_title, service_price, total_amount, payment_method)
-- VALUES ('attente_paiement_sur_place', 'Test', 'test@example.com', '0600000000', 'Test', 50, 50, 'sur_place');
--
-- Tester une insertion invalide (doit échouer):
-- INSERT INTO reservations (status, customer_name, customer_email, customer_phone, service_title, service_price, total_amount, payment_method)
-- VALUES ('attente_paiement_sur_place', '', '', '', 'Test', 50, 50, 'sur_place');
-- =============================================================================
