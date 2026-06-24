import { userRepository } from "../repositories/user.repository";
import logger from "@/lib/logger";

export class GetUserService {
  async execute(id: string) {
    logger.info("Getting user", { userId: id });
    return userRepository.findById(id, {
      include: { agency: true, reports: true },
    });
  }

  async getByEmail(email: string) {
    logger.info("Getting user by email", { email });
    return userRepository.findByEmail(email);
  }
}

export const getUserService = new GetUserService();
