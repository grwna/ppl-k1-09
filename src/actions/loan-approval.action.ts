"use server"

import { processLoanApproval } from "@/services/loan-approval.service";
import { loanApprovalSchema } from "@/schemas/loan-approval.schema";
import { revalidatePath } from "next/cache";

export async function approveOrRejectLoanAction(payload: {
  applicationId: string;
  status: "APPROVED" | "REJECTED";
  amount?: number;
  reason?: string;
  adminId: string;
}) {
  const parsed = loanApprovalSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await processLoanApproval(parsed.data);
    revalidatePath("/admin/loan-requests");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}