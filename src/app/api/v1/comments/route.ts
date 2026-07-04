import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { auth } from "@/server/auth";
import { assertOwnerOrAgency, ForbiddenError } from "@/server/authz";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    await assertOwnerOrAgency(
      {
        id: session.user.id,
        role: session.user.role as any,
        agencyId: session.user.agencyId || null,
      },
      reportId
    );

    const comments = await db.reportComment.findMany({
      where: { reportId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: comments });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    logger.error({ error }, "Failed to fetch comments");
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
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

    const body = await request.json();
    const { reportId, message } = body;

    if (!reportId || !message) {
      return NextResponse.json({ error: "reportId and message are required" }, { status: 400 });
    }

    await assertOwnerOrAgency(
      {
        id: session.user.id,
        role: session.user.role as any,
        agencyId: session.user.agencyId || null,
      },
      reportId
    );

    const comment = await db.reportComment.create({
      data: {
        reportId,
        userId: session.user.id,
        message,
      },
      include: { user: true },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    logger.error({ error }, "Failed to create comment");
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
