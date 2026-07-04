import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { auth } from "@/server/auth";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const resourceType = searchParams.get("resourceType");
    const resourceId = searchParams.get("resourceId");
    const actorId = searchParams.get("actorId");

    let logs;
    if (resourceType && resourceId) {
      logs = await db.auditLog.findMany({
        where: { resourceType, resourceId },
        orderBy: { createdAt: "desc" },
        include: { actor: true },
      });
    } else if (actorId) {
      logs = await db.auditLog.findMany({
        where: { actorId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      logs = await db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }

    return NextResponse.json({ data: logs });
  } catch (error) {
    logger.error({ error }, "Error fetching audit logs");
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
