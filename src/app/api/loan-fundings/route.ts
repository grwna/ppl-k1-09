import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CreateLoanFundingSchema } from "@/schemas/loan-funding.schema";
import { LoanFundingService } from "@/services/loan-funding.service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRoles = (session.user as any).roles || [];
    if (!userRoles.includes("ADMIN")) {
      return NextResponse.json({ error: "Hanya admin yang dapat mengalokasikan dana" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateLoanFundingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const allocation = await LoanFundingService.allocateDonorFund(parsed.data);

    return NextResponse.json(
      {
        message: "Alokasi dana berhasil dibuat",
        data: allocation,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LOAN_NOT_FOUND") {
        return NextResponse.json({ error: "Pinjaman tidak ditemukan" }, { status: 404 });
      }
      if (error.message === "DONOR_FUND_NOT_FOUND") {
        return NextResponse.json({ error: "Dana donor tidak ditemukan" }, { status: 404 });
      }
      if (error.message === "INSUFFICIENT_DONOR_FUND") {
        return NextResponse.json({ error: "Sisa dana donor tidak mencukupi" }, { status: 400 });
      }
      if (error.message === "LOAN_OVER_ALLOCATION") {
        return NextResponse.json({ error: "Alokasi melebihi sisa kebutuhan pinjaman" }, { status: 400 });
      }
    }

    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2034") {
      return NextResponse.json(
        { error: "Alokasi sedang diproses oleh request lain, coba lagi" },
        { status: 409 }
      );
    }

    console.error("Create loan funding error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
