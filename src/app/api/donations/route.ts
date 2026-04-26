import { NextRequest, NextResponse } from "next/server";
import { DonationSchema } from "@/schemas/donations.schema";
import { DonationService } from "@/services/donations.service";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Harap login terlebih dahulu." }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();

    const validationResult = DonationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const result = await DonationService.createDonation(
      userId,
      validationResult.data
    );

    return NextResponse.json(
      { message: "Donasi berhasil direkam", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");

    if (view === "dashboard") {
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const dashboardData = await DonationService.getDonorDashboard(userId);
      return NextResponse.json({ data: dashboardData }, { status: 200 });
    }

    // default response for donation listing
    const result = await DonationService.getDonations()

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