-- =============================================================================
-- MIGRATION RLS - TABLE ADMIN_LOGS
-- Objectif: Sécuriser les logs d'audit (données sensibles)
-- =============================================================================

-- 1. ACTIVER RLS SUR LA TABLE ADMIN_LOGS
ALTER TABLE "admin_logs" ENABLE ROW LEVEL SECURITY;

-- 2. POLITIQUE: INSERT - Service_role uniquement (backend)
-- Seul le backend (Prisma) peut créer des logs
DROP POLICY IF EXISTS "Service role can insert admin logs" ON "admin_logs";
CREATE POLICY "Service role can insert admin logs" 
ON "admin_logs" 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 3. POLITIQUE: SELECT - Admins uniquement
-- Seuls les admins peuvent consulter les logs
DROP POLICY IF EXISTS "Admins can view admin logs" ON "admin_logs";
CREATE POLICY "Admins can view admin logs" 
ON "admin_logs" 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- 4. NOTE: Pas de politique UPDATE/DELETE
-- Les logs ne doivent jamais être modifiés ou supprimés (immutabilité)
-- Si besoin de nettoyage, utiliser TRUNCATE en tant que superadmin

-- =============================================================================
-- VÉRIFICATION APRÈS MIGRATION:
-- =============================================================================
-- Vérifier RLS activé:
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'admin_logs';
--
-- Vérifier les politiques:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'admin_logs';
--
-- =============================================================================
-- RÈGLES DE SÉCURITÉ:
-- - Service_role peut créer des logs
-- - Admins (role ADMIN/DEVELOPER) peuvent lire les logs
-- - Personne ne peut modifier/supprimer les logs
-- - Le public (anon) n'a AUCUN accès
-- =============================================================================
