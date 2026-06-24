import { NextRequest, NextResponse } from "next/server";
import { markNotificationReadService } from "@/modules/notifications/services/mark-notification-read.service";
import logger from "@/lib/logger";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, props: { params: Params }) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const { userId } = body;
    await markNotificationReadService.execute(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Error marking notification as read");
    return NextResponse.json({ error: "Failed to mark notification" }, { status: 500 });
  }
}
