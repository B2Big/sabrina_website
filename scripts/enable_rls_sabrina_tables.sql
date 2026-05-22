-- =============================================================================
-- MIGRATION RLS - TABLES SABRINA (Post db push)
-- Objectif: Sécuriser toutes les tables Sabrina après synchronisation
-- =============================================================================

-- =============================================================================
-- 1. SERVICES
-- =============================================================================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read services" ON public.services;
CREATE POLICY "Public can read services"
ON public.services FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Service role can manage services" ON public.services;
CREATE POLICY "Service role can manage services"
ON public.services FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 2. PROMOTIONS
-- =============================================================================
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read promotions" ON public.promotions;
CREATE POLICY "Public can read promotions"
ON public.promotions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Service role can manage promotions" ON public.promotions;
CREATE POLICY "Service role can manage promotions"
ON public.promotions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 3. ORDERS (sensibles - service_role uniquement)
-- =============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;
CREATE POLICY "Service role can manage orders"
ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 4. NEWSLETTER_SUBSCRIBERS
-- =============================================================================
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Le public peut s'inscrire
DROP POLICY IF EXISTS "Public can subscribe newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe newsletter"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND email <> '' AND email LIKE '%@%'
);

-- Service role peut tout faire (backend)
DROP POLICY IF EXISTS "Service role can manage newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Service role can manage newsletter"
ON public.newsletter_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 5. RESERVATIONS
-- =============================================================================
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Le public peut créer une réservation (formulaire contact)
DROP POLICY IF EXISTS "Public can insert reservations" ON public.reservations;
CREATE POLICY "Public can insert reservations"
ON public.reservations FOR INSERT TO anon, authenticated
WITH CHECK (
  customer_email IS NOT NULL AND customer_email <> '' AND customer_email LIKE '%@%'
  AND customer_name IS NOT NULL AND customer_name <> ''
  AND customer_phone IS NOT NULL AND customer_phone <> ''
);

-- Service role peut tout faire (backend + webhooks)
DROP POLICY IF EXISTS "Service role can manage reservations" ON public.reservations;
CREATE POLICY "Service role can manage reservations"
ON public.reservations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 6. ADMIN_LOGS
-- =============================================================================
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Service role peut créer des logs (backend)
DROP POLICY IF EXISTS "Service role can insert admin logs" ON public.admin_logs;
CREATE POLICY "Service role can insert admin logs"
ON public.admin_logs FOR INSERT TO service_role WITH CHECK (true);

-- Service role peut lire les logs (backend)
DROP POLICY IF EXISTS "Service role can read admin logs" ON public.admin_logs;
CREATE POLICY "Service role can read admin logs"
ON public.admin_logs FOR SELECT TO service_role USING (true);

-- =============================================================================
-- 7. _PROMOTIONTOSERVICE (table de relation)
-- =============================================================================
ALTER TABLE public."_PromotionToService" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read relation" ON public."_PromotionToService";
CREATE POLICY "Public can read relation"
ON public."_PromotionToService" FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Service role can manage relation" ON public."_PromotionToService";
CREATE POLICY "Service role can manage relation"
ON public."_PromotionToService" FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- VÉRIFICATION FINALE
-- =============================================================================
SELECT 
    tablename,
    rowsecurity as "RLS",
    (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as "Policies"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE '_prisma%'
ORDER BY tablename;
