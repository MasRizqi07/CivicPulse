import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  agencyId: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ passwordHash: true });
