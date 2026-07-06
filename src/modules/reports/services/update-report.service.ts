import db from "@/server/db";
import { reportRepository } from "../repositories/report.repository";
import logger from "@/lib/logger";
import { assertOwnerOrAgency, ForbiddenError } from "@/server/authz";
import type { UpdateReportDto } from "../types";
import type { Role } from "@prisma/client";

export class UpdateReportService {
  async execute(
    reportId: string,
    user: { id: string; role: Role; agencyId: string | null },
    data: UpdateReportDto
  ) {
    logger.info({ reportId, userId: user.id }, `Updating report`);

    // Check authorization
    const { report } = await assertOwnerOrAgency(user, reportId);

    // Only citizens can update their own draft reports
    if (user.role === "CITIZEN" && report && report.status !== "DRAFT") {
      throw new ForbiddenError("Citizens can only update draft reports");
    }

    const result = await db.$transaction(async (tx) => {
      // Get current report
      const currentReport = await tx.report.findUnique({
        where: { id: reportId },
      });

      if (!currentReport) {
        throw new Error("Report not found");
      }

      // Update report
      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data,
        include: { citizen: true, agency: true, location: true, assignedOfficer: true },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "UPDATE_REPORT",
          resourceType: "REPORT",
          resourceId: reportId,
          oldValues: currentReport as any,
          newValues: data as any,
        },
      });

      return updatedReport;
    });

    return result;
  }
}

export const updateReportService = new UpdateReportService();
