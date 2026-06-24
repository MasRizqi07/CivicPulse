import { z } from "zod";
import { ReportStatus } from "@prisma/client";

export const createHistorySchema = z.object({
  reportId: z.string(),
  actorId: z.string(),
  oldStatus: z.nativeEnum(ReportStatus).optional(),
  newStatus: z.nativeEnum(ReportStatus),
  note: z.string().optional(),
});
