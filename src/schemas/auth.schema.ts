import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.string().optional(),
});

export const VerifySchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type VerifyInput = z.infer<typeof VerifySchema>;
