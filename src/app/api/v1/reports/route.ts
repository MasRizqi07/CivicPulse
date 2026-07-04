import { NextRequest, NextResponse } from "next/server";
import { reportRepository } from "@/modules/reports/repositories/report.repository";
import { createReportService } from "@/modules/reports/services/create-report.service";
import { createReportSchema } from "@/modules/reports/validators/create-report.schema";
import logger from "@/lib/logger";
import { auth } from "@/server/auth";
import { getReportWhereForUser, ForbiddenError } from "@/server/authz";
import { checkRateLimit, getRateLimitHeaders } from "@/server/rate-limiter";
import { createError, handleError, errorCodes } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        createError(errorCodes.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    const user = session.user as any;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const agencyId = searchParams.get("agencyId");

    // Get base where clause filtered by user's role
    const where = getReportWhereForUser(user);

    // Apply additional filters
    if (status) (where as any).status = status;
    if (category) (where as any).category = category;
    
    // Agency ID filter - only allowed for officers/admins
    if (agencyId) {
      if (user.role === "CITIZEN") {
        return NextResponse.json(
          createError(errorCodes.FORBIDDEN, 'Citizens cannot filter by agency'),
          { status: 403 }
        );
      }
      // Officers can only filter their own agency
      if (user.role === "OFFICER" && user.agencyId !== agencyId) {
        return NextResponse.json(
          createError(errorCodes.FORBIDDEN, 'Cannot filter other agencies'),
          { status: 403 }
        );
      }
      (where as any).agencyId = agencyId;
    }

    // Filter out null values from where clause
    const finalWhere = Object.fromEntries(
      Object.entries(where).filter(([_, v]) => v !== null && v !== undefined)
    );

    const [reports, total] = await Promise.all([
      reportRepository.findAll(finalWhere, {
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { citizen: true, agency: true, location: true },
      }),
      reportRepository.count(finalWhere),
    ]);

    return NextResponse.json({
      data: reports,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, "Error fetching reports");
    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        createError(errorCodes.FORBIDDEN, error.message),
        { status: 403 }
      );
    }
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        createError(errorCodes.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Only citizens can create reports
    if (user.role !== "CITIZEN") {
      return NextResponse.json(
        createError(errorCodes.FORBIDDEN, 'Only citizens can create reports'),
        { status: 403 }
      );
    }

    // Check rate limit for report creation (per user)
    const rateLimitResult = await checkRateLimit(user.id, "reportCreate");

    if (!rateLimitResult.success) {
      return NextResponse.json(
        createError(errorCodes.RATE_LIMIT_EXCEEDED, 'Too many report submissions. Please try again later.'),
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const body = await request.json();
    const validated = createReportSchema.parse(body);

    const report = await createReportService.execute(user.id, validated);

    const response = NextResponse.json({ data: report }, { status: 201 });
    // Add rate limit headers
    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error: any) {
    logger.error({ error }, "Error creating report");
    if (error.name === "ZodError") {
      const fields: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        fields[err.path.join('.')] = err.message;
      });
      return NextResponse.json(
        createError(errorCodes.VALIDATION_ERROR, 'Validation failed', fields),
        { status: 400 }
      );
    }
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
