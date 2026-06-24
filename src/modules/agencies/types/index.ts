import type { Agency as PrismaAgency } from "@prisma/client";

export interface Agency extends PrismaAgency {}

export interface CreateAgencyInput {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
}

export interface UpdateAgencyInput {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}
