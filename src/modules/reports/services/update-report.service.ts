import db from "@/server/db";
import { reportRepository } from "../repositories/report.repository";
import logger from "@/lib/logger";
import type { UpdateReportDto } from "../types";

export class UpdateReportService {
  async execute(reportId: string, actorId: string, data: UpdateReportDto) {
    logger.info({ reportId }, `Updating report`);

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
          actorId,
          action: "UPDATE_REPORT",
          resourceType: "REPORT",
          resourceId: reportId,
          oldValues: currentReport,
          newValues: data,
        },
      });

      return updatedReport;
    });

    return result;
  }
}

export const updateReportService = new UpdateReportService();
