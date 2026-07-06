import { locationRepository } from "../repositories/location.repository";
import logger from "@/lib/logger";

export class GetLocationService {
  async execute(id: string) {
    logger.info({ locationId: id }, "Getting location");
    return locationRepository.findById(id, {
      include: { reports: true },
    } as any);
  }

  async getByCity(city: string) {
    logger.info({ city }, "Getting locations by city");
    return locationRepository.findByCity(city);
  }

  async getByProvince(province: string) {
    logger.info({ province }, "Getting locations by province");
    return locationRepository.findByProvince(province);
  }
}

export const getLocationService = new GetLocationService();
