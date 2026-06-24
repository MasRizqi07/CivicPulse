import { agencyRepository } from "../repositories/agency.repository";
import logger from "@/lib/logger";

export class GetAgencyService {
  async execute(id: string) {
    logger.info({ agencyId: id }, "Getting agency");
    return agencyRepository.findById(id);
  }

  async getAll() {
    logger.info({}, "Getting all agencies");
    return agencyRepository.findAll({ isActive: true });
  }
}

export const getAgencyService = new GetAgencyService();
