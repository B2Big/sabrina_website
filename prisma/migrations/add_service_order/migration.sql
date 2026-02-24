-- AlterTable
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "service_order" INTEGER DEFAULT 0;

-- Update existing services with incremental order based on createdAt
UPDATE "services" 
SET "service_order" = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY "createdat" ASC) - 1 as row_num
    FROM "services"
) AS subquery
WHERE "services".id = subquery.id;
