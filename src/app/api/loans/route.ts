import { NextRequest, NextResponse } from "next/server";
import { LoanApplicationSchema } from "@/schemas/loan.schema";
import { LoanService } from "@/services/loan.service";
import { LoanApplicationStatus } from "@/generated/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Harap login terlebih dahulu." }, { status: 401 });
    }
    const userId = session.user.id;

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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // 1. Extract the URL from the request
    const { searchParams } = new URL(req.url);

    // 2. Get parameters from query string
    // Note: searchParams.get() always returns a string or null
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");
    const status = searchParams.get("status"); // Default to PENDING if not provided

    // 3. Convert start/end to numbers (and handle defaults)
    const start = startStr ? parseInt(startStr, 10) : 0;
    const end = endStr ? parseInt(endStr, 10) : 10;

    // 4. get loan requests
    let result;
    if (status) {
      result = await LoanService.getLoanApplication(
        start,
        end,
        status == "PENDING" ? LoanApplicationStatus.PENDING : (status == "APPROVED" ? LoanApplicationStatus.APPROVED : LoanApplicationStatus.REJECTED)
      ) 
    } else {
      result = await LoanService.getLoanApplication(
        start,
        end
      ) 
    }

    // Output disesuaikan dengan TC-05 Dokumen Teknis
    return NextResponse.json({ data: result }, { status: 200 });
    
  } catch (error) {
    console.error("Fetch loan requests error:", error);
    
    if (error instanceof Error) {
      if (error.message === "APPLICATION_NOT_FOUND") {
        return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
      }
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Anda tidak memiliki akses ke aplikasi ini" }, { status: 403 });
      }
    }
    
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
