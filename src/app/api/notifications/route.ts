import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NotificationService } from "@/services/notification.service";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const requestedLimit = Number(url.searchParams.get("limit") ?? 5);
    const limit = Number.isFinite(requestedLimit) ? requestedLimit : 5;

    const result = await NotificationService.getLatestForUser({
      userId: session.user.id,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 }
    );
  }
}
