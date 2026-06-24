import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class HistoryRepository extends BaseRepository<
  Prisma.ReportHistoryGetPayload<{}>,
  Prisma.ReportHistoryCreateInput,
  Prisma.ReportHistoryUpdateInput,
  Prisma.ReportHistoryWhereInput,
  Prisma.ReportHistoryWhereUniqueInput,
  Prisma.ReportHistoryInclude,
  Prisma.ReportHistoryOrderByWithRelationInput
> {
  protected model = "reportHistory" as const;

  async findByReport(reportId: string) {
    return db.reportHistory.findMany({
      where: { reportId },
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    });
  }
}

export const historyRepository = new HistoryRepository();
