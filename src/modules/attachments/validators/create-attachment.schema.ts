import { z } from "zod";

export const createAttachmentSchema = z.object({
  reportId: z.string(),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  mimeType: z.string(),
  uploadedBy: z.string(),
});
