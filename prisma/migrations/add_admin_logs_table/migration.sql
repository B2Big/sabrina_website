-- =============================================================================
-- MIGRATION : Création de la table admin_logs pour l'audit trail
-- =============================================================================

-- Création de la table admin_logs
CREATE TABLE "admin_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- Création des index pour les performances
CREATE INDEX "admin_logs_user_id_idx" ON "admin_logs"("user_id");
CREATE INDEX "admin_logs_action_idx" ON "admin_logs"("action");
CREATE INDEX "admin_logs_created_at_idx" ON "admin_logs"("created_at");

-- =============================================================================
-- NOTES :
-- =============================================================================
-- Cette table stocke l'historique des actions admin (création, modification, suppression)
-- Champs importants :
--   - action: CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE, LOGIN, etc.
--   - entity_type: Service, Promotion, etc.
--   - entity_id: ID de l'entité concernée (optionnel)
--   - details: JSON avec les détails de l'action
-- 
-- Vérification après migration:
--   SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 10;
-- =============================================================================
