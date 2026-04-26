import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DocumentService } from "@/services/document.service";
import { UploadDocumentSchema, validateFile } from "@/schemas/document.schema";

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

export async function POST(
  req: Request,
  props: { params: Promise<{ applicationId: string }> }
) {
  try {
    // Verify Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await props.params;

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validate Metadata using Zod
    const metadataParsed = UploadDocumentSchema.safeParse({ applicationId, documentType });
    if (!metadataParsed.success) {
      return NextResponse.json(
        { error: metadataParsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Validate File specifics
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRoles = (session.user as any).roles || [];

    // Hand over to Service Layer
    const attachment = await DocumentService.uploadDocument(
      session.user.id,
      userRoles,
      metadataParsed.data.applicationId,
      metadataParsed.data.documentType,
      file
    );

    return NextResponse.json(
      { message: "Dokumen berhasil diunggah", attachment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      if (error.message === "APPLICATION_NOT_FOUND") {
        return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
      }
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Anda tidak memiliki akses ke aplikasi ini" }, { status: 403 });
      }
      if (error.message === "UPLOAD_FAILED") {
        return NextResponse.json({ error: "Gagal mengunggah file ke penyimpanan" }, { status: 502 });
      }
    }
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
