import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { LoanService } from "@/services/loan.service";

const ApproveApplicationSchema = z.object({
  approvedAmount: z
    .union([z.number(), z.string()])
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value), "approvedAmount harus berupa angka")
    .refine((value) => value > 0, "approvedAmount harus lebih dari 0"),
  notes: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  props: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = ((session.user as { roles?: string[] }).roles || []) as string[];
    if (!roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Hanya admin yang dapat menyetujui pinjaman" }, { status: 403 });
    }

    const { applicationId } = await props.params;
    const body = await req.json();
    const parsed = ApproveApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = await LoanService.approveLoanApplication({
      applicationId,
      adminId: session.user.id,
      approvedAmount: parsed.data.approvedAmount,
      notes: parsed.data.notes,
    });

    return NextResponse.json(
      { message: "Pengajuan pinjaman berhasil disetujui", data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "APPLICATION_NOT_FOUND") {
      return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
    }

    console.error("Approve loan application error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
