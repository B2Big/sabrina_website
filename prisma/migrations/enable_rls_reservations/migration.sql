-- Activer RLS sur la table reservations
ALTER TABLE "reservations" ENABLE ROW LEVEL SECURITY;

-- Politique: Les admins peuvent tout voir et tout modifier
CREATE POLICY "Admins full access on reservations" 
ON "reservations" 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- Politique: Les clients peuvent voir leurs propres réservations (par email)
CREATE POLICY "Users can view own reservations" 
ON "reservations" 
FOR SELECT 
TO authenticated 
USING (
  "customer_email" = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Politique: Lecture anonyme pour les webhooks Stripe (si nécessaire)
-- Note: Les webhooks Stripe ne passent pas par l'authentification Supabase
-- Donc on laisse les fonctions serverless gérer ça
