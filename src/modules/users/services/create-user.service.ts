import { userRepository } from "../repositories/user.repository";
import logger from "@/lib/logger";
import type { CreateUserDTO } from "../types";

export class CreateUserService {
  async execute(data: CreateUserDTO) {
    logger.info({ email: data.email }, "Creating user");

    const user = await userRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      ...(data.agencyId && { agency: { connect: { id: data.agencyId } } }),
    });

    logger.info({ userId: user.id }, "User created successfully");
    return user;
  }
}

export const createUserService = new CreateUserService();
