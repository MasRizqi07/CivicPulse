import { locationRepository } from "../repositories/location.repository";
import logger from "@/lib/logger";

export class GetLocationService {
  async execute(id: string) {
    logger.info("Getting location", { locationId: id });
    return locationRepository.findById(id, {
      include: { reports: true },
    });
  }

  async getByCity(city: string) {
    logger.info("Getting locations by city", { city });
    return locationRepository.findByCity(city);
  }

  async getByProvince(province: string) {
    logger.info("Getting locations by province", { province });
    return locationRepository.findByProvince(province);
  }
}

export const getLocationService = new GetLocationService();
