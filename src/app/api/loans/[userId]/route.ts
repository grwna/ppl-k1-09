import { NextRequest, NextResponse } from "next/server";
import { LoanApplicationSchema } from "@/schemas/loan.schema";
import { LoanService } from "@/services/loan.service";
import { LoanApplicationStatus } from "@/generated/prisma";

// Add 'Promise' to the type definition for params
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ userId: string }> } 
) {
  try {
    // Await the params object before accessing userId
    const { userId } = await params;

    const result = await LoanService.getLoanApplicationsByUserId(userId);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error in GET /api/loans/[userId]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}