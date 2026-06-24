import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class LocationRepository extends BaseRepository<
  Prisma.LocationGetPayload<{}>,
  Prisma.LocationCreateInput,
  Prisma.LocationUpdateInput,
  Prisma.LocationWhereInput,
  Prisma.LocationWhereUniqueInput,
  Prisma.LocationInclude,
  Prisma.LocationOrderByWithRelationInput
> {
  protected model = "location" as const;

  async findByCity(city: string) {
    return db.location.findMany({
      where: { city },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByProvince(province: string) {
    return db.location.findMany({
      where: { province },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const locationRepository = new LocationRepository();
