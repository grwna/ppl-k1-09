import { z } from "zod";

export const UpdateLoanStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Status hanya boleh APPROVED atau REJECTED" }),
  }),
});

export type UpdateLoanStatusInput = z.infer<typeof UpdateLoanStatusSchema>;