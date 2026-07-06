import { NextRequest, NextResponse } from "next/server";
import { markNotificationReadService } from "@/modules/notifications/services/mark-notification-read.service";
import { auth } from "@/server/auth";
import logger from "@/lib/logger";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, props: { params: Params }) {
  try {
    const { id } = await props.params;
    
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // userId comes from session, not request body
    const userId = session.user.id;
    await markNotificationReadService.execute(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Error marking notification as read");
    return NextResponse.json({ error: "Failed to mark notification" }, { status: 500 });
  }
}
