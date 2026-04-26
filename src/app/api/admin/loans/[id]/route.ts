import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/services/admin.service";
import { UpdateLoanStatusSchema } from "@/schemas/admin.schema";
// import { auth } from "@/auth"; // <-- MATIKAN SEMENTARA

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // --- MATIKAN SEMENTARA FITUR LOGIN/ROLE UNTUK DUMMY FE ---
    /*
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden. Akses khusus Admin." }, { status: 403 });
    }
    */

    const loanId = context.params.id;
    const body = await req.json();

    // Validasi input status
    const validationResult = UpdateLoanStatusSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Eksekusi update di database
    const updatedData = await AdminService.updateLoanStatus(
      loanId,
      validationResult.data.status
    );

    return NextResponse.json(
      { message: `Pengajuan berhasil diubah menjadi ${validationResult.data.status}`, data: updatedData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}