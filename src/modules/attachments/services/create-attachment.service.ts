import { attachmentRepository } from "../repositories/attachment.repository";
import logger from "@/lib/logger";
import type { CreateAttachmentDTO } from "../types";

export class CreateAttachmentService {
  async execute(data: CreateAttachmentDTO) {
    logger.info({ reportId: data.reportId, fileName: data.fileName }, "Creating attachment");

    const attachment = await attachmentRepository.create({
      report: { connect: { id: data.reportId } },
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: BigInt(data.fileSize),
      mimeType: data.mimeType,
      uploadedBy: data.uploadedBy,
    });

    logger.info({ attachmentId: attachment.id }, "Attachment created successfully");
    return attachment;
  }
}

export const createAttachmentService = new CreateAttachmentService();
