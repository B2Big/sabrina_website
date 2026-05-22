-- =============================================================================
-- VÉRIFICATION COMPLÈTE RLS - Toutes les tables publiques
-- =============================================================================

-- Lister toutes les tables du schéma public sans RLS activé
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE '_prisma%'
  AND rowsecurity = false
ORDER BY tablename;

-- Lister toutes les tables du schéma public AVEC RLS activé
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE '_prisma%'
  AND rowsecurity = true
ORDER BY tablename;

-- Compteur récapitulatif
SELECT 
    COUNT(*) FILTER (WHERE rowsecurity = true) as "RLS Activé",
    COUNT(*) FILTER (WHERE rowsecurity = false) as "RLS Désactivé",
    COUNT(*) as "Total Tables"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE '_prisma%';
