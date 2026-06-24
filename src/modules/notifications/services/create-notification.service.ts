import { notificationRepository } from "../repositories/notification.repository";
import logger from "@/lib/logger";
import type { CreateNotificationDTO } from "../types";

export class CreateNotificationService {
  async execute(data: CreateNotificationDTO) {
    logger.info("Creating notification", { userId: data.userId, title: data.title });

    const notification = await notificationRepository.create({
      user: { connect: { id: data.userId } },
      title: data.title,
      message: data.message,
    });

    logger.info("Notification created successfully", { notificationId: notification.id });
    return notification;
  }
}

export const createNotificationService = new CreateNotificationService();
