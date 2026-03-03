-- =============================================================================
-- MIGRATION RLS - TABLE RESERVATIONS
-- Objectif: Sécuriser les données des réservations tout en permettant 
--           les réservations publiques et protégeant la lecture admin
-- =============================================================================

-- 1. ACTIVER RLS SUR LA TABLE RESERVATIONS
-- Cette commande active la Row Level Security sur la table
ALTER TABLE "reservations" ENABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien activé
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'reservations';

-- =============================================================================
-- POLITIQUES DE SÉCURITÉ
-- =============================================================================

-- POLITIQUE 1: INSERT PUBLIC (ANONYME)
-- Permettre à n'importe qui (même non authentifié) de créer une réservation
-- C'est nécessaire pour que les clients puissent réserver sans compte
DROP POLICY IF EXISTS "Allow public insert on reservations" ON "reservations";
CREATE POLICY "Allow public insert on reservations" 
ON "reservations" 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- POLITIQUE 2: SELECT RESTREINT AU SERVICE_ROLE (ADMIN)
-- Seul le rôle service_role (utilisé par le backend) peut lire toutes les réservations
-- Les utilisateurs authentifiés normaux ne peuvent pas faire de SELECT
DROP POLICY IF EXISTS "Service role can select all reservations" ON "reservations";
CREATE POLICY "Service role can select all reservations" 
ON "reservations" 
FOR SELECT 
TO service_role
USING (true);

-- POLITIQUE 3: SELECT POUR LES ADMINS AUTHENTIFIÉS
-- Les admins avec rôle ADMIN ou DEVELOPER peuvent voir toutes les réservations
DROP POLICY IF EXISTS "Admins can select all reservations" ON "reservations";
CREATE POLICY "Admins can select all reservations" 
ON "reservations" 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- POLITIQUE 4: UPDATE POUR LES ADMINS ET SERVICE_ROLE
-- Seuls les admins et le service_role peuvent modifier les réservations
DROP POLICY IF EXISTS "Admins and service role can update reservations" ON "reservations";
CREATE POLICY "Admins and service role can update reservations" 
ON "reservations" 
FOR UPDATE 
TO authenticated, service_role
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- POLITIQUE 5: DELETE POUR LES ADMINS UNIQUEMENT
-- Seuls les admins peuvent supprimer des réservations
DROP POLICY IF EXISTS "Admins can delete reservations" ON "reservations";
CREATE POLICY "Admins can delete reservations" 
ON "reservations" 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- =============================================================================
-- NOTES IMPORTANTES
-- =============================================================================

/*
COMMENT ÇA FONCTIONNE:

1. INSERT PUBLIC:
   - Tout le monde peut créer une réservation (clients anonymes)
   - Nécessaire pour le formulaire de contact public
   
2. SELECT RESTREINT:
   - Le public (anon) NE PEUT PAS lire les réservations
   - Les utilisateurs authentifiés normaux NE PEUVENT PAS lire
   - Seuls les admins (role ADMIN/DEVELOPER) et service_role peuvent lire
   
3. WEBHOOKS STRIPE:
   - Les webhooks utilisent le service_role via Prisma
   - Donc ils peuvent lire/mettre à jour les réservations
   
4. DASHBOARD ADMIN:
   - Le dashboard utilise l'authentification Supabase
   - Les admins avec rôle approprié peuvent voir/modifier les réservations

VÉRIFICATION APRÈS MIGRATION:

-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservations';

-- Vérifier les politiques
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reservations';

-- Tester l'insertion anonyme (doit fonctionner)
-- INSERT INTO reservations (status, customer_name, customer_email, customer_phone, service_title, service_price, total_amount, payment_method) 
-- VALUES ('attente_paiement_sur_place', 'Test', 'test@test.com', '0600000000', 'Test Service', 50, 50, 'sur_place');

-- Tester le select anonyme (doit échouer avec RLS)
-- SELECT * FROM reservations; -- Doit retourner 0 lignes pour anon
*/
