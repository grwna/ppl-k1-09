import { NextRequest, NextResponse } from "next/server";
import { LoanApplicationSchema } from "@/schemas/loan.schema";
import { LoanService } from "@/services/loan.service";

export async function POST(req: NextRequest) {
  try {
    // --- MATIKAN SEMENTARA FITUR LOGIN UNTUK TESTING ---
    /*
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Harap login terlebih dahulu." }, { status: 401 });
    }
    const userId = session.user.id;
    */
    
    // --- GUNAKAN ID USER DARI DATABASE (BYPASS) ---
    // Menggunakan UUID dari akun 'Felix Tester' yang sama seperti pengujian Donasi
    const userId = "550e8400-e29b-41d4-a716-446655440000"; 

    const body = await req.json();

    // TC-05: Memastikan data diri dan nominal pinjaman valid
    const validationResult = LoanApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Rekam ke database
    const result = await LoanService.createLoanApplication(
      userId,
      validationResult.data
    );

    // Output disesuaikan dengan TC-05 Dokumen Teknis
    return NextResponse.json(
      { message: "Pengajuan Berhasil Dikirim", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}