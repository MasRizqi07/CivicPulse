import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { ReportStatus } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class ReportRepository extends BaseRepository<
  Prisma.ReportGetPayload<{}>,
  Prisma.ReportCreateInput,
  Prisma.ReportUpdateInput,
  Prisma.ReportWhereInput,
  Prisma.ReportWhereUniqueInput,
  Prisma.ReportInclude,
  Prisma.ReportOrderByWithRelationInput
> {
  protected model = "report" as const;

  async findByReportNumber(
    reportNumber: string,
    include?: Prisma.ReportInclude,
    includeDeleted = false
  ) {
    return db.report.findUnique({
      where: {
        reportNumber,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include,
    });
  }

  async findByCitizen(citizenId: string, includeDeleted = false) {
    return db.report.findMany({
      where: { citizenId, ...(includeDeleted ? {} : { deletedAt: null }) },
      orderBy: { createdAt: "desc" },
      include: { citizen: true, agency: true, location: true },
    });
  }

  async findByAgency(agencyId: string, includeDeleted = false) {
    return db.report.findMany({
      where: { agencyId, ...(includeDeleted ? {} : { deletedAt: null }) },
      orderBy: { createdAt: "desc" },
      include: { citizen: true, agency: true, location: true },
    });
  }

  async findByStatus(status: ReportStatus, includeDeleted = false) {
    return db.report.findMany({
      where: { status, ...(includeDeleted ? {} : { deletedAt: null }) },
      orderBy: { createdAt: "desc" },
      include: { citizen: true, agency: true, location: true },
    });
  }

  /**
   * Generate a collision-safe report number using DB sequence
   */
  async generateReportNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const prefix = `CP-${year}${month}`;

    // Use a DB transaction with atomic counter
    const result = await db.$transaction(async (tx) => {
      // Create a report sequence row if it doesn't exist
      const sequence = await tx.reportSequence.upsert({
        where: { prefix },
        update: { counter: { increment: 1 } },
        create: { prefix, counter: 1 },
      });

      return sequence.counter;
    });

    const seq = String(result).padStart(4, "0");
    return `${prefix}-${seq}`;
  }
}

export const reportRepository = new ReportRepository();
