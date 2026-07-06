import { NextRequest, NextResponse } from "next/server";
import { reportRepository } from "@/modules/reports/repositories/report.repository";
import { getReportService } from "@/modules/reports/services/get-report.service";
import { updateReportService } from "@/modules/reports/services/update-report.service";
import { updateReportStatusService } from "@/modules/reports/services/update-report-status.service";
import { assignReportService } from "@/modules/reports/services/assign-report.service";
import { getSessionUser, assertOwnerOrAgency, ForbiddenError, NotFoundError, UnauthorizedError } from "@/server/authz";
import logger from "@/lib/logger";
import type { ReportStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await getReportService.execute(id, user);
    return NextResponse.json({ data: report });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn({ error }, "Unauthorized access to report");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.warn({ error }, "Forbidden access to report");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof NotFoundError) {
      logger.warn({ error }, "Report not found");
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    logger.error({ error }, "Error fetching report");
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // actorId is never read from body - identity comes from session
    const { actorId, ...data } = body;
    
    const report = await updateReportService.execute(id, user, data);
    return NextResponse.json({ data: report });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn({ error }, "Unauthorized access to update report");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.warn({ error }, "Forbidden access to update report");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof NotFoundError) {
      logger.warn({ error }, "Report not found");
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    logger.error({ error }, "Error updating report");
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, actorId, ...data } = body;

    let result;

    if (action === "update-status") {
      result = await updateReportStatusService.execute(
        id,
        user,
        data.status as ReportStatus,
        data.note
      );
    } else if (action === "assign") {
      result = await assignReportService.execute(
        id,
        user,
        data.officerId,
        data.note
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn({ error }, "Unauthorized access to patch report");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.warn({ error }, "Forbidden access to patch report");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof NotFoundError) {
      logger.warn({ error }, "Report not found");
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    logger.error({ error }, "Error patching report");
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization before delete
    const { report } = await assertOwnerOrAgency(user, id);

    // Only SUPER_ADMIN or the owning citizen (for draft reports) can delete
    if (user.role !== "SUPER_ADMIN") {
      if (user.role === "CITIZEN") {
        // Citizens can only delete their own draft reports
        if (!report || report.citizenId !== user.id || report.status !== "DRAFT") {
          throw new ForbiddenError("Citizens can only delete their own draft reports");
        }
      } else {
        // Officers cannot delete reports
        throw new ForbiddenError("Officers cannot delete reports");
      }
    }

    await reportRepository.delete(id);
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn({ error }, "Unauthorized access to delete report");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.warn({ error }, "Forbidden access to delete report");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof NotFoundError) {
      logger.warn({ error }, "Report not found");
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    logger.error({ error }, "Error deleting report");
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
