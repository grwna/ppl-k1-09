import { z } from "zod";

export const DonationSchema = z.object({
  amount: z.number().positive("Nominal donasi harus lebih dari 0"),
  paymentType: z.string().min(1, "Metode pembayaran harus diisi"),
});

export type DonationInput = z.infer<typeof DonationSchema>;