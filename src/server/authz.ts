import db from "./db";
import type { User, Role } from "@prisma/client";

// Custom errors
export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Assert that the user has access to the report via ownership or agency scope
 */
export async function assertOwnerOrAgency(
  user: { id: string; role: Role; agencyId: string | null },
  reportId: string
): Promise<{
  report: Awaited<ReturnType<typeof db.report.findUnique>>;
}> {
  const report = await db.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError("Report not found");
  }

  // Super admin can access everything
  if (user.role === "SUPER_ADMIN") {
    return { report };
  }

  // Citizen can only access their own reports
  if (user.role === "CITIZEN" && report.citizenId === user.id) {
    return { report };
  }

  // Officer can access reports in their agency
  if (user.role === "OFFICER" && user.agencyId && report.agencyId === user.agencyId) {
    return { report };
  }

  // No access
  throw new ForbiddenError("You do not have access to this report");
}

/**
 * Assert that the user has agency scope access
 */
export function assertAgencyScope(
  user: { id: string; role: Role; agencyId: string | null },
  agencyId: string
): void {
  // Super admin can access everything
  if (user.role === "SUPER_ADMIN") {
    return;
  }

  // Officer must belong to the agency
  if (user.role === "OFFICER") {
    if (!user.agencyId || user.agencyId !== agencyId) {
      throw new ForbiddenError("You do not have access to this agency's data");
    }
    return;
  }

  // Citizens should not be accessing agency-scoped data
  throw new ForbiddenError("You do not have access to this resource");
}

/**
 * Get the where clause for filtered report queries based on user role
 */
export function getReportWhereForUser(user: {
  id: string;
  role: Role;
  agencyId: string | null;
}) {
  if (user.role === "SUPER_ADMIN") {
    return {};
  } else if (user.role === "OFFICER") {
    return { agencyId: user.agencyId };
  } else {
    // Citizen
    return { citizenId: user.id };
  }
}
