import { NextResponse } from "next/server";
import { VerifySchema } from "@/schemas/auth.schema";
import { UserService } from "@/services/user.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const user = await UserService.verifyCredentials(parsed.data.email, parsed.data.password);

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
