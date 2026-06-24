import { NextRequest, NextResponse } from "next/server";
import { notificationRepository } from "@/modules/notifications/repositories/notification.repository";
import { markNotificationReadService } from "@/modules/notifications/services/mark-notification-read.service";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const notifications = await notificationRepository.findByUserId(userId, unreadOnly);
    const unreadCount = await notificationRepository.countUnread(userId);

    return NextResponse.json({ data: notifications, meta: { unreadCount } });
  } catch (error) {
    logger.error({ error }, "Error fetching notifications");
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    await markNotificationReadService.markAllRead(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Error marking notifications as read");
    return NextResponse.json({ error: "Failed to mark notifications" }, { status: 500 });
  }
}
