import type { ReportStatus } from "@prisma/client";

/**
 * Allowed status transitions for reports
 */
export const STATUS_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["ASSIGNED", "REJECTED"],
  ASSIGNED: ["IN_PROGRESS", "SUBMITTED"],
  IN_PROGRESS: ["RESOLVED", "ASSIGNED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
  REJECTED: [],
  ARCHIVED: [],
};

/**
 * Check if a status transition is allowed
 */
export function isTransitionAllowed(
  from: ReportStatus,
  to: ReportStatus
): boolean {
  const allowed = STATUS_TRANSITIONS[from];
  return allowed.includes(to);
}
