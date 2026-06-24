import { NextRequest, NextResponse } from "next/server";
import { reportRepository } from "@/modules/reports/repositories/report.repository";
import { getReportService } from "@/modules/reports/services/get-report.service";
import { updateReportService } from "@/modules/reports/services/update-report.service";
import { updateReportStatusService } from "@/modules/reports/services/update-report-status.service";
import { assignReportService } from "@/modules/reports/services/assign-report.service";
import logger from "@/lib/logger";
import type { ReportStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await getReportService.execute(id);
    return NextResponse.json({ data: report });
  } catch (error) {
    logger.error({ error }, "Error fetching report");
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // NOTE: In real app, actorId would come from auth session
    const { actorId, ...data } = body;
    
    const report = await updateReportService.execute(id, actorId || "system", data);
    return NextResponse.json({ data: report });
  } catch (error) {
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
    const body = await request.json();
    const { action, actorId, ...data } = body;

    let result;

    if (action === "update-status") {
      result = await updateReportStatusService.execute(
        id,
        actorId || "system",
        data.status as ReportStatus,
        data.note
      );
    } else if (action === "assign") {
      result = await assignReportService.execute(
        id,
        actorId || "system",
        data.officerId,
        data.note
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
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
    await reportRepository.delete(id);
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    logger.error({ error }, "Error deleting report");
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
