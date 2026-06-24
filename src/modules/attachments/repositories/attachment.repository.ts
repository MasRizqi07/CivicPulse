import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class AttachmentRepository extends BaseRepository<
  Prisma.ReportAttachmentGetPayload<{}>,
  Prisma.ReportAttachmentCreateInput,
  Prisma.ReportAttachmentUpdateInput,
  Prisma.ReportAttachmentWhereInput,
  Prisma.ReportAttachmentWhereUniqueInput,
  Prisma.ReportAttachmentInclude,
  Prisma.ReportAttachmentOrderByWithRelationInput
> {
  protected model = "reportAttachment" as const;

  async findByReport(reportId: string) {
    return db.reportAttachment.findMany({
      where: { reportId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const attachmentRepository = new AttachmentRepository();
