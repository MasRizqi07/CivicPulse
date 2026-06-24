import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class NotificationRepository extends BaseRepository<
  Prisma.NotificationGetPayload<{}>,
  Prisma.NotificationCreateInput,
  Prisma.NotificationUpdateInput,
  Prisma.NotificationWhereInput,
  Prisma.NotificationWhereUniqueInput,
  Prisma.NotificationInclude,
  Prisma.NotificationOrderByWithRelationInput
> {
  protected model = "notification" as const;

  async findByUserId(userId: string, unreadOnly?: boolean) {
    return db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async countUnread(userId: string) {
    return db.notification.count({
      where: { userId, isRead: false },
    });
  }
}

export const notificationRepository = new NotificationRepository();
