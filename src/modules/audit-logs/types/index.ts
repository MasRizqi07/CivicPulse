import type { AuditLog } from "@prisma/client";

export interface AuditLogDTO extends AuditLog {}

export interface CreateAuditLogDTO {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}
