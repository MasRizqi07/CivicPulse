import { z } from "zod";

export const createAuditLogSchema = z.object({
  actorId: z.string(),
  action: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string(),
  oldValues: z.any().optional(),
  newValues: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});
