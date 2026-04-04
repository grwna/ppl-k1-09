import { z } from "zod";

export const LoanApplicationSchema = z.object({
  requestedAmount: z.number().positive("Nominal pinjaman harus lebih dari 0"),
  description: z.string().min(10, "Deskripsi keperluan pinjaman minimal 10 karakter"),
  collateralUrl: z.string().url("Format URL dokumen jaminan tidak valid"),
  collateralDescription: z.string().min(5, "Deskripsi jaminan wajib diisi"),
});

export type LoanApplicationInput = z.infer<typeof LoanApplicationSchema>;