import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { LoanService } from "@/services/loan.service";

const RejectApplicationSchema = z.object({
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
      return NextResponse.json({ error: "Hanya admin yang dapat menolak pinjaman" }, { status: 403 });
    }

    const { applicationId } = await props.params;
    const body = await req.json().catch(() => ({}));
    const parsed = RejectApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = await LoanService.rejectLoanApplication({
      applicationId,
      adminId: session.user.id,
      notes: parsed.data.notes,
    });

    return NextResponse.json(
      { message: "Pengajuan pinjaman berhasil ditolak", data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "APPLICATION_NOT_FOUND") {
      return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
    }

    console.error("Reject loan application error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
