import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  try {
    // --- MATIKAN SEMENTARA FITUR LOGIN/ROLE UNTUK TESTING ---
    /*
    const session = await auth();
    // Di aplikasi nyata, kita harus cek apakah user memiliki role 'ADMIN'
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Akses ditolak." }, { status: 401 });
    }
    */

    // Mengambil rekapitulasi data donasi dan pinjaman
    const dashboardData = await AdminService.getDashboardSummary();

    return NextResponse.json(
      { 
        message: "Data rekapitulasi berhasil dimuat", 
        data: dashboardData 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}