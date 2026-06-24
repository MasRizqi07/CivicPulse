import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class CommentRepository extends BaseRepository<
  Prisma.ReportCommentGetPayload<{}>,
  Prisma.ReportCommentCreateInput,
  Prisma.ReportCommentUpdateInput,
  Prisma.ReportCommentWhereInput,
  Prisma.ReportCommentWhereUniqueInput,
  Prisma.ReportCommentInclude,
  Prisma.ReportCommentOrderByWithRelationInput
> {
  protected model = "reportComment" as const;

  async findByReport(reportId: string) {
    return db.reportComment.findMany({
      where: { reportId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }
}

export const commentRepository = new CommentRepository();
