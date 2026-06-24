import { auditLogRepository } from "../repositories/audit-log.repository";
import logger from "@/lib/logger";
import type { CreateAuditLogDTO } from "../types";

export class CreateAuditLogService {
  async execute(data: CreateAuditLogDTO) {
    logger.info({ actorId: data.actorId, action: data.action }, "Creating audit log");

    const auditLog = await auditLogRepository.create({
      actorId: data.actorId,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    logger.info({ auditLogId: auditLog.id }, "Audit log created successfully");
    return auditLog;
  }
}

export const createAuditLogService = new CreateAuditLogService();
