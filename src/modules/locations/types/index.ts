import type { Location } from "@prisma/client";

export interface LocationDTO extends Location {}

export interface CreateLocationDTO {
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  city: string;
  province: string;
  postalCode?: string;
}
