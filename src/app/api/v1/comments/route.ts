import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get("reportId");

    const where: any = {};
    if (reportId) where.reportId = reportId;

    const comments = await db.reportComment.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: comments });
  } catch (error) {
    logger.error({ error }, "Failed to fetch comments");
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, userId, message } = body;

    const comment = await db.reportComment.create({
      data: {
        reportId,
        userId,
        message,
      },
      include: { user: true },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create comment");
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
