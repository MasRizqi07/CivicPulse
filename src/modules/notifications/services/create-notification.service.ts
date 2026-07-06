import { notificationRepository } from "../repositories/notification.repository";
import logger from "@/lib/logger";
import type { CreateNotificationDTO } from "../types";

export class CreateNotificationService {
  async execute(data: CreateNotificationDTO) {
    logger.info({ userId: data.userId, title: data.title }, "Creating notification");

    const notification = await notificationRepository.create({
      user: { connect: { id: data.userId } },
      title: data.title,
      message: data.message,
    });

    logger.info({ notificationId: notification.id }, "Notification created successfully");
    return notification;
  }
}

export const createNotificationService = new CreateNotificationService();
