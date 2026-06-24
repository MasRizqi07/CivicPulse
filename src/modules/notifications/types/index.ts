import type { Notification } from "@prisma/client";

export interface NotificationDTO extends Notification {}

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
}
