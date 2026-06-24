import { NextRequest, NextResponse } from "next/server";
import { auditLogRepository } from "@/modules/audit-logs/repositories/audit-log.repository";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resourceType = searchParams.get("resourceType");
    const resourceId = searchParams.get("resourceId");
    const actorId = searchParams.get("actorId");

    let logs;
    if (resourceType && resourceId) {
      logs = await auditLogRepository.findByResource(resourceType, resourceId);
    } else if (actorId) {
      logs = await auditLogRepository.findByActor(actorId);
    } else {
      logs = await auditLogRepository.findAll(undefined, { orderBy: { createdAt: "desc" }, take: 100 });
    }

    return NextResponse.json({ data: logs });
  } catch (error) {
    logger.error({ error }, "Error fetching audit logs");
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
