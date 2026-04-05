import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/auth.schema";
import { UserService } from "@/services/user.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const user = await UserService.register(parsed.data);
    return NextResponse.json({ message: "Registrasi berhasil", user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
