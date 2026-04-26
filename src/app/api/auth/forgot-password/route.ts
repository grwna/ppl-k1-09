import { NextResponse } from "next/server";
import { ForgotPasswordSchema } from "@/schemas/auth.schema";
import { UserService } from "@/services/user.service";
import { NotificationEmailService } from "@/services/notification-email.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const token = await UserService.createPasswordResetToken(email);

    // Always return success to avoid email enumeration
    if (token) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await NotificationEmailService.send({
        to: email,
        subject: "Reset Password - Rumah Amal Salman",
        message: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #16C5DE;">Reset Password</h2>
            <p>Kami menerima permintaan untuk mereset password akun Anda di Rumah Amal Salman.</p>
            <p>Klik tombol di bawah ini untuk membuat password baru. Link ini berlaku selama <strong>1 jam</strong>.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                style="background-color: #16C5DE; color: white; padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #888; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ message: "Jika email terdaftar, link reset password sudah dikirim." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
