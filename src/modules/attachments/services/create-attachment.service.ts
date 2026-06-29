import { attachmentRepository } from "../repositories/attachment.repository";
import logger from "@/lib/logger";
import { assertOwnerOrAgency } from "@/server/authz";
import type { CreateAttachmentDTO } from "../types";
import type { Role } from "@prisma/client";

export class CreateAttachmentService {
  async execute(data: CreateAttachmentDTO, user: { id: string; role: Role; agencyId: string | null }) {
    logger.info({ reportId: data.reportId, fileName: data.fileName }, "Creating attachment");

    // Check authorization - user must have access to the report
    await assertOwnerOrAgency(user, data.reportId);

    const attachment = await attachmentRepository.create({
      report: { connect: { id: data.reportId } },
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: BigInt(data.fileSize),
      mimeType: data.mimeType,
      uploadedBy: user.id,
    });

    logger.info({ attachmentId: attachment.id }, "Attachment created successfully");
    return attachment;
  }
}

export const createAttachmentService = new CreateAttachmentService();
