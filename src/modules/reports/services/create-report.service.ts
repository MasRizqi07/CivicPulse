import db from "@/server/db";
import { reportRepository } from "../repositories/report.repository";
import type { CreateReportDto } from "../types";
import logger from "@/lib/logger";
import { auditLogQueue, notificationQueue } from "@/server/queue";

export class CreateReportService {
  async execute(citizenId: string, data: CreateReportDto) {
    logger.info({ title: data.title }, `Creating report for citizen ${citizenId}`);

    // Start transaction
    const result = await db.$transaction(async (tx) => {
      // Create location
      const location = await tx.location.create({
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          district: data.district,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
        },
      });

      // Get default agency (TODO: Implement proper agency assignment logic)
      const defaultAgency = await tx.agency.findFirst({
        where: { isActive: true },
      });

      if (!defaultAgency) {
        throw new Error("No active agency available");
      }

      // Generate report number
      const reportNumber = await reportRepository.generateReportNumber();

      // Create report
      const report = await tx.report.create({
        data: {
          reportNumber,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          citizenId,
          agencyId: defaultAgency.id,
          locationId: location.id,
        },
      });

      // Create attachments if any
      if (data.attachments && data.attachments.length > 0) {
        await tx.reportAttachment.createMany({
          data: data.attachments.map((attachment) => ({
            reportId: report.id,
            fileName: attachment.fileName,
            fileUrl: attachment.fileUrl,
            fileSize: BigInt(attachment.fileSize),
            mimeType: attachment.mimeType,
            uploadedBy: citizenId,
          })),
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: citizenId,
          action: "CREATE_REPORT",
          resourceType: "REPORT",
          resourceId: report.id,
          newValues: { report, attachments: data.attachments },
        },
      });

      return report;
    });

    // Queue notification
    await notificationQueue.add("report-created", { reportId: result.id });

    // Queue analytics update
    await auditLogQueue.add("report-created", { reportId: result.id });

    return result;
  }
}

export const createReportService = new CreateReportService();
