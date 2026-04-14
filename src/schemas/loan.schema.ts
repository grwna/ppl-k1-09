import { z } from "zod";

export const LoanApplicationSchema = z.object({
  requestedAmount: z.number().positive("Nominal pinjaman harus lebih dari 0"),
  description: z.string().min(10, "Deskripsi keperluan pinjaman minimal 10 karakter"),
  collateralUrl: z.string(),
  collateralDescription: z.string()
});

export type LoanApplicationInput = z.infer<typeof LoanApplicationSchema>;