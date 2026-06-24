import { agencyRepository } from "../repositories/agency.repository";
import logger from "@/lib/logger";
import type { CreateAgencyInput } from "../types";

export class CreateAgencyService {
  async execute(input: CreateAgencyInput) {
    logger.info({ name: input.name }, "Creating agency");

    const agency = await agencyRepository.create({
      name: input.name,
      description: input.description,
      phone: input.phone,
      email: input.email,
    });

    logger.info({ agencyId: agency.id }, "Agency created successfully");
    return agency;
  }
}

export const createAgencyService = new CreateAgencyService();
