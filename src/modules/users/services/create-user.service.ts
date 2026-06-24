import { userRepository } from "../repositories/user.repository";
import logger from "@/lib/logger";
import type { CreateUserDTO } from "../types";

export class CreateUserService {
  async execute(data: CreateUserDTO) {
    logger.info("Creating user", { email: data.email });

    const user = await userRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      agencyId: data.agencyId,
    });

    logger.info("User created successfully", { userId: user.id });
    return user;
  }
}

export const createUserService = new CreateUserService();
