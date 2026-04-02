import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DocumentService } from "@/services/document.service";

export async function GET(
  req: Request,
  props: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRoles = (session.user as any).roles || [];
    const params = await props.params;

    const attachments = await DocumentService.getAttachmentsForApplication(
      params.applicationId,
      session.user.id,
      userRoles
    );

    return NextResponse.json({ data: attachments }, { status: 200 });
  } catch (error) {
    console.error("Fetch attachments error:", error);
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
