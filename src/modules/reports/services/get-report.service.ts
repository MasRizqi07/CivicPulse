import { reportRepository } from "../repositories/report.repository";
import logger from "@/lib/logger";
import { assertOwnerOrAgency } from "@/server/authz";
import type { User, Role } from "@prisma/client";

export class GetReportService {
  async execute(reportId: string, user: { id: string; role: Role; agencyId: string | null }) {
    logger.info({ reportId, userId: user.id }, `Fetching report`);

    // First check authorization (will throw 403 or 404)
    await assertOwnerOrAgency(user, reportId);

    const report = await reportRepository.findById(reportId, {
      citizen: true,
      agency: true,
      location: true,
      assignedOfficer: true,
      attachments: true,
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      histories: { include: { actor: true }, orderBy: { createdAt: "desc" } },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }
}

export const getReportService = new GetReportService();
