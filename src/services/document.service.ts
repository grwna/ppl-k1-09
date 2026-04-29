import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "loan-documents";

export const DocumentService = {
  /**
   * Uploads a file to Supabase Storage and creates a record in Prisma.
   */
  async uploadDocument(
    userId: string,
    roles: string[],
    applicationId: string,
    documentType: string,
    file: File
  ) {
    // Validate application exists and belongs to the user
    // let Prisma foreign keys handle the basic existence
    const application = await prisma.loanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    if (application.borrowerId !== userId && !roles.includes("ADMIN")) {
      throw new Error("UNAUTHORIZED");
    }

    // Upload true file to Supabase
    const fileExt = file.name.split(".").pop() || "bin";
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    // Format: userId/applicationId/documentType/filename.ext
    const storagePath = `${userId}/${applicationId}/${documentType}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error("UPLOAD_FAILED");
    }

    // Save metadata to Prisma
    // store the storagePath in fileUrl. When retrieving, generate signed URLs.
    const attachment = await prisma.applicationAttachment.create({
      data: {
        applicationId,
        documentType,
        fileUrl: storagePath,
      },
    });

    return attachment;
  },

  /**
   * Retrieves all attachments for an application.
   * Generates short-lived signed URLs for each private file so the client can view them.
   */
  async getAttachmentsForApplication(applicationId: string, userId: string, roles: string[]) {
    const application = await prisma.loanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    if (application.borrowerId !== userId && !roles.includes("ADMIN")) {
      throw new Error("UNAUTHORIZED");
    }

    const attachments = await prisma.applicationAttachment.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: "desc" },
    });

    // Generate signed URLs (valid for 3600 seconds)
    const attachmentsWithUrls = await Promise.all(
      attachments.map(async (doc) => {
        const { data } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .createSignedUrl(doc.fileUrl, 3600);

        return {
          ...doc,
          // Replace the raw storage path with the temporary signed URL
          fileUrl: data?.signedUrl || `/api/attachments/${doc.id}`,
        };
      })
    );

    return attachmentsWithUrls;
  },

  async getSignedAttachmentUrl(attachmentId: string, userId: string, roles: string[]) {
    const attachment = await prisma.applicationAttachment.findUnique({
      where: { id: attachmentId },
      include: { loanApplication: true },
    });

    if (!attachment) {
      throw new Error("ATTACHMENT_NOT_FOUND");
    }

    if (attachment.loanApplication.borrowerId !== userId && !roles.includes("ADMIN")) {
      throw new Error("UNAUTHORIZED");
    }

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(attachment.fileUrl, 3600);

    if (error || !data?.signedUrl) {
      console.error("Supabase signed URL error:", error);
      throw new Error("SIGN_URL_FAILED");
    }

    return data.signedUrl;
  },

  /**
   * Deletes a document both from Prisma and Supabase Storage.
   */
  async deleteAttachment(attachmentId: string, userId: string, roles: string[]) {
    const attachment = await prisma.applicationAttachment.findUnique({
      where: { id: attachmentId },
      include: { loanApplication: true },
    });

    if (!attachment) {
      throw new Error("ATTACHMENT_NOT_FOUND");
    }

    // Only owner or ADMIN can delete
    if (attachment.loanApplication.borrowerId !== userId && !roles.includes("ADMIN")) {
      throw new Error("UNAUTHORIZED");
    }

    // Delete from Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([attachment.fileUrl]);

    if (error) {
      console.error("Supabase delete error:", error);
      // Optional: still proceed to delete DB record, or throw? better to throw to avoid orphans
      throw new Error("DELETE_STORAGE_FAILED");
    }

    // Delete from Prisma
    await prisma.applicationAttachment.delete({
      where: { id: attachmentId },
    });

    return true;
  },
};
