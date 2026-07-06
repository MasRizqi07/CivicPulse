import db from "@/server/db";
import { reportRepository } from "../repositories/report.repository";
import { createHistoryService } from "@/modules/histories/services/create-history.service";
import { notificationQueue } from "@/server/queue";
import logger from "@/lib/logger";
import { isTransitionAllowed } from "../types/transitions";
import { assertOwnerOrAgency, ForbiddenError } from "@/server/authz";
import type { ReportStatus, Role } from "@prisma/client";

export class UpdateReportStatusService {
  async execute(
    reportId: string,
    user: { id: string; role: Role; agencyId: string | null },
    newStatus: ReportStatus,
    note?: string
  ) {
    logger.info(
      { reportId, newStatus, userId: user.id },
      `Updating report status`
    );

    // First check authorization
    const { report } = await assertOwnerOrAgency(user, reportId);

    // Only officers and admins can update status
    if (user.role === "CITIZEN") {
      throw new ForbiddenError("Citizens cannot update report status");
    }

    // Validate status transition
    if (!isTransitionAllowed(report!.status, newStatus)) {
      throw new Error(
        `Invalid status transition from ${report!.status} to ${newStatus}`
      );
    }

    const result = await db.$transaction(async (tx) => {
      // Update report
      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data: {
          status: newStatus,
          resolvedAt: newStatus === "RESOLVED" ? new Date() : report!.resolvedAt,
          closedAt: newStatus === "CLOSED" ? new Date() : report!.closedAt,
        },
        include: {
          citizen: true,
          agency: true,
          location: true,
          assignedOfficer: true,
        },
      });

      // Create history record
      await tx.reportHistory.create({
        data: {
          reportId,
          actorId: user.id,
          oldStatus: report!.status,
          newStatus,
          note,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "UPDATE_REPORT_STATUS",
          resourceType: "REPORT",
          resourceId: reportId,
          oldValues: { status: report!.status },
          newValues: { status: newStatus },
        },
      });

      return updatedReport;
    });

    // Queue notification for citizen
    await notificationQueue.add("report-status-updated", {
      reportId,
      userId: result.citizenId,
      status: newStatus,
    });

    return result;
  }
}

export const updateReportStatusService = new UpdateReportStatusService();
