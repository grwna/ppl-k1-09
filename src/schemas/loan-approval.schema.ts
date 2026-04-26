import { z } from "zod";

export const loanApprovalSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  amount: z.number().min(1).optional(),
  reason: z.string().optional(),
  adminId: z.string().min(1),
}).superRefine((data, ctx) => {
  if (data.status === "APPROVED") {
    if (data.amount === undefined || data.amount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nominal wajib diisi dan harus lebih dari 0 jika menyetujui pinjaman",
        path: ["amount"],
      });
    }
  }
  if (data.status === "REJECTED") {
    if (!data.reason || data.reason.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Alasan wajib diisi jika menolak pinjaman",
        path: ["reason"],
      });
    }
  }
});