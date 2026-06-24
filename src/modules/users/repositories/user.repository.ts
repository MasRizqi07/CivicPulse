import db from "@/server/db";
import type { Prisma } from "@prisma/client";
import { BaseRepository } from "@/server/base-repository";

export class UserRepository extends BaseRepository<
  Prisma.UserGetPayload<{}>,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserInclude,
  Prisma.UserOrderByWithRelationInput
> {
  protected model = "user" as const;

  async findByEmail(email: string, include?: Prisma.UserInclude) {
    return db.user.findUnique({
      where: { email },
      include,
    });
  }
}

export const userRepository = new UserRepository();
