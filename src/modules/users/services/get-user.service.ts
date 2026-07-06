import { userRepository } from "../repositories/user.repository";
import logger from "@/lib/logger";

export class GetUserService {
  async execute(id: string) {
    logger.info({ userId: id }, "Getting user");
    return userRepository.findById(id, {
      include: { agency: true, reports: true },
    } as any);
  }

  async getByEmail(email: string) {
    logger.info({ email }, "Getting user by email");
    return userRepository.findByEmail(email);
  }
}

export const getUserService = new GetUserService();
