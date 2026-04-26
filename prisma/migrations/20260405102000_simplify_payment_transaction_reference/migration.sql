-- Simplify payment references: use one business reference ID + category
ALTER TABLE "PaymentTransaction"
ADD COLUMN "referenceId" UUID;

UPDATE "PaymentTransaction"
SET "referenceId" = COALESCE("referenceRepayment", "referenceDonorFund", "id"::uuid)
WHERE "referenceId" IS NULL;

ALTER TABLE "PaymentTransaction"
ALTER COLUMN "referenceId" SET NOT NULL;

ALTER TABLE "PaymentTransaction"
DROP CONSTRAINT IF EXISTS "PaymentTransaction_referenceRepayment_fkey";

ALTER TABLE "PaymentTransaction"
DROP CONSTRAINT IF EXISTS "PaymentTransaction_referenceDonorFund_fkey";

ALTER TABLE "PaymentTransaction"
DROP COLUMN IF EXISTS "referenceRepayment",
DROP COLUMN IF EXISTS "referenceDonorFund";

CREATE INDEX IF NOT EXISTS "PaymentTransaction_referenceId_category_idx"
ON "PaymentTransaction"("referenceId", "category");
