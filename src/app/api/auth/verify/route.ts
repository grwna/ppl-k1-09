import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Return user data including roles (to be consumed by NextAuth authorize)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name)
    }, { status: 200 });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
