import { notificationRepository } from "../repositories/notification.repository";
import logger from "@/lib/logger";

export class MarkNotificationReadService {
  async execute(id: string, userId: string) {
    logger.info("Marking notification as read", { notificationId: id, userId });
    return notificationRepository.update(id, { isRead: true });
  }

  async markAllRead(userId: string) {
    logger.info("Marking all notifications as read", { userId });
    const unread = await notificationRepository.findByUserId(userId, true);
    for (const n of unread) {
      await notificationRepository.update(n.id, { isRead: true });
    }
  }
}

export const markNotificationReadService = new MarkNotificationReadService();
