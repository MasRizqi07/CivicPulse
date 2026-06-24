import type { ReportHistory, ReportStatus } from "@prisma/client";

export interface HistoryDTO extends ReportHistory {}

export interface CreateHistoryDTO {
  reportId: string;
  actorId: string;
  oldStatus?: ReportStatus;
  newStatus: ReportStatus;
  note?: string;
}
