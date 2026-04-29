import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DocumentService } from "@/services/document.service";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRoles = (session.user as any).roles || [];
    const params = await props.params;

    await DocumentService.deleteAttachment(params.attachmentId, session.user.id, userRoles);

    return NextResponse.json({ message: "Dokumen berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Delete attachment error:", error);
    if (error instanceof Error) {
      if (error.message === "ATTACHMENT_NOT_FOUND") {
        return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
      }
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Anda tidak memiliki akses untuk menghapus dokumen ini" }, { status: 403 });
      }
      if (error.message === "DELETE_STORAGE_FAILED") {
        return NextResponse.json({ error: "Gagal menghapus file dari penyimpanan" }, { status: 502 });
      }
    }
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
