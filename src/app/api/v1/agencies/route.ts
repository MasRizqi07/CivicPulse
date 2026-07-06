import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { auth } from "@/server/auth";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const agencies = await db.agency.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: agencies });
  } catch (error) {
    logger.error({ error }, "Failed to fetch agencies");
    return NextResponse.json(
      { error: "Failed to fetch agencies" },
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

    // Only SUPER_ADMIN can create agencies
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const agency = await db.agency.create({
      data: body,
    });

    return NextResponse.json({ data: agency }, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create agency");
    return NextResponse.json(
      { error: "Failed to create agency" },
      { status: 500 }
    );
  }
}
