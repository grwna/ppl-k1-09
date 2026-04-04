-- Reverse payment linkage: business rows reference payment transaction
ALTER TABLE "DonorFund"
ADD COLUMN "paymentTransactionId" UUID;

ALTER TABLE "Repayment"
ADD COLUMN "paymentTransactionId" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "DonorFund_paymentTransactionId_key"
ON "DonorFund"("paymentTransactionId");

CREATE UNIQUE INDEX IF NOT EXISTS "Repayment_paymentTransactionId_key"
ON "Repayment"("paymentTransactionId");

ALTER TABLE "DonorFund"
ADD CONSTRAINT "DonorFund_paymentTransactionId_fkey"
FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Repayment"
ADD CONSTRAINT "Repayment_paymentTransactionId_fkey"
FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
