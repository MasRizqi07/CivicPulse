import { NextRequest, NextResponse } from "next/server";
import { reportRepository } from "@/modules/reports/repositories/report.repository";
import { createReportService } from "@/modules/reports/services/create-report.service";
import { createReportSchema } from "@/modules/reports/validators/create-report.schema";
import logger from "@/lib/logger";
import { auth } from "@/server/auth";
import { getReportWhereForUser, ForbiddenError } from "@/server/authz";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    // Get base where clause filtered by user's role
    const where = getReportWhereForUser(user);

    // Apply additional filters
    if (status) (where as any).status = status;

    const [reports, total] = await Promise.all([
      reportRepository.findAll(where, {
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { citizen: true, agency: true, location: true },
      }),
      reportRepository.count(where),
    ]);

    return NextResponse.json({
      data: reports,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, "Error fetching reports");
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only citizens can create reports
    if (user.role !== "CITIZEN") {
      return NextResponse.json({ error: "Only citizens can create reports" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createReportSchema.parse(body);

    const report = await createReportService.execute(user.id, validated);

    return NextResponse.json({ data: report }, { status: 201 });
  } catch (error: any) {
    logger.error({ error }, "Error creating report");
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
