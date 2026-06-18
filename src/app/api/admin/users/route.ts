// /api/admin/users/route.ts
import { auth } from "@/auth";
import { UserService } from "../../../../services/user.service"; // Adjust path to user.service
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Authorization safeguard
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Extrapolate query filters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const isVerified = searchParams.get("isVerified");
    const search = searchParams.get("search");

    // 3. Delegation down to the isolated user service
    const { users, pagination } = await UserService.getAllUsers({
      page,
      limit,
      role,
      isVerified,
      search,
    });

    // 4. Return the structured, clean payload response
    return NextResponse.json(
      {
        data: users,
        pagination,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}