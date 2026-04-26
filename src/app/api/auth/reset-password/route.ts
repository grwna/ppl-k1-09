import { NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/schemas/auth.schema";
import { UserService } from "@/services/user.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token wajib diisi" }, { status: 400 });
    }

    const email = await UserService.getEmailByResetToken(token);
    if (!email) {
      return NextResponse.json({ error: "Token tidak valid atau sudah kadaluarsa" }, { status: 400 });
    }

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Get reset token error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const success = await UserService.resetPassword(token, password);

    if (!success) {
      return NextResponse.json(
        { error: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Password berhasil direset" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
