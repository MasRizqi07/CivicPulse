import type { ReportAttachment } from "@prisma/client";

export interface AttachmentDTO extends ReportAttachment {}

export interface CreateAttachmentDTO {
  reportId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
}
