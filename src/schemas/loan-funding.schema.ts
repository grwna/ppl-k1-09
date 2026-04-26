import { z } from "zod";

const AmountSchema = z
  .union([z.number(), z.string()])
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value), "amount harus berupa angka")
  .refine((value) => value > 0, "amount harus lebih dari 0");

export const CreateLoanFundingSchema = z.object({
  loanId: z.string().uuid("loanId harus berupa UUID yang valid"),
  donorFundId: z.string().uuid("donorFundId harus berupa UUID yang valid"),
  amount: AmountSchema,
});

export type CreateLoanFundingInput = z.infer<typeof CreateLoanFundingSchema>;
