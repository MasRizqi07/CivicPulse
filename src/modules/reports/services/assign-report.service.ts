import db from "@/server/db";
import { reportRepository } from "../repositories/report.repository";
import { createHistoryService } from "@/modules/histories/services/create-history.service";
import { notificationQueue } from "@/server/queue";
import logger from "@/lib/logger";
import { assertOwnerOrAgency, ForbiddenError } from "@/server/authz";
import type { Role } from "@prisma/client";

export class AssignReportService {
  async execute(
    reportId: string,
    user: { id: string; role: Role; agencyId: string | null },
    officerId: string,
    note?: string
  ) {
    logger.info(
      { reportId, officerId, userId: user.id },
      `Assigning report to officer ${officerId}`
    );

    // Check authorization
    const { report } = await assertOwnerOrAgency(user, reportId);

    // Only admins/officers can assign
    if (user.role === "CITIZEN") {
      throw new ForbiddenError("Citizens cannot assign reports");
    }

    // Get officer to check agency
    const officer = await db.user.findUnique({
      where: { id: officerId },
    });

    if (!officer) {
      throw new Error("Officer not found");
    }

    if (officer.role !== "OFFICER") {
      throw new Error("User is not an officer");
    }

    // Check officer is in same agency as report
    if (officer.agencyId !== report.agencyId) {
      throw new ForbiddenError("Officer is not in the same agency as the report");
    }

    const result = await db.$transaction(async (tx) => {
      // Update report
      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data: {
          assignedOfficerId: officerId,
          status: "ASSIGNED",
        },
        include: { citizen: true, agency: true, location: true, assignedOfficer: true },
      });

      // Create history record
      await tx.reportHistory.create({
        data: {
          reportId,
          actorId: user.id,
          oldStatus: report.status,
          newStatus: "ASSIGNED",
          note: note || `Assigned to officer ${officerId}`,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "ASSIGN_REPORT",
          resourceType: "REPORT",
          resourceId: reportId,
          oldValues: { assignedOfficerId: report.assignedOfficerId, status: report.status },
          newValues: { assignedOfficerId: officerId, status: "ASSIGNED" },
        },
      });

      return updatedReport;
    });

    // Queue notification for officer
    await notificationQueue.add("report-assigned", {
      reportId,
      userId: officerId,
    });

    return result;
  }
}

export const assignReportService = new AssignReportService();
