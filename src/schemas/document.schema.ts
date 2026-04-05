import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Validates the metadata structure for uploading a document.
 */
export const UploadDocumentSchema = z.object({
  applicationId: z.string().uuid("applicationId harus berupa UUID yang valid"),
  documentType: z.string().min(1, "documentType wajib diisi"),
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;

/**
 * Validates the actual File object parameters
 */
export function validateFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran file tidak boleh melebihi 10MB" };
  }
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Tipe file tidak didukung. Gunakan JPG, PNG, atau PDF" };
  }
  return { valid: true };
}
