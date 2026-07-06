import { locationRepository } from "../repositories/location.repository";
import logger from "@/lib/logger";
import type { CreateLocationDTO } from "../types";
import { Prisma } from "@prisma/client";

export class CreateLocationService {
  async execute(data: CreateLocationDTO) {
    logger.info({ address: data.address }, "Creating location");

    const location = await locationRepository.create({
      latitude: new Prisma.Decimal(data.latitude),
      longitude: new Prisma.Decimal(data.longitude),
      address: data.address,
      district: data.district,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
    });

    logger.info({ locationId: location.id }, "Location created successfully");
    return location;
  }
}

export const createLocationService = new CreateLocationService();
