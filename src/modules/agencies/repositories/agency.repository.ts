import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class AgencyRepository extends BaseRepository<
  Prisma.AgencyGetPayload<{}>,
  Prisma.AgencyCreateInput,
  Prisma.AgencyUpdateInput,
  Prisma.AgencyWhereInput,
  Prisma.AgencyWhereUniqueInput,
  Prisma.AgencyInclude,
  Prisma.AgencyOrderByWithRelationInput
> {
  protected model = "agency" as const;
}

export const agencyRepository = new AgencyRepository();
