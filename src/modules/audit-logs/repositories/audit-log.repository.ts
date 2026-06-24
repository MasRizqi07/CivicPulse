import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class AuditLogRepository extends BaseRepository<
  Prisma.AuditLogGetPayload<{}>,
  Prisma.AuditLogCreateInput,
  Prisma.AuditLogUpdateInput,
  Prisma.AuditLogWhereInput,
  Prisma.AuditLogWhereUniqueInput,
  Prisma.AuditLogInclude,
  Prisma.AuditLogOrderByWithRelationInput
> {
  protected model = "auditLog" as const;

  async findByResource(resourceType: string, resourceId: string) {
    return db.auditLog.findMany({
      where: { resourceType, resourceId },
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    });
  }

  async findByActor(actorId: string) {
    return db.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
