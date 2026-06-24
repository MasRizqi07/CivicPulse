import type { User, Role } from "@prisma/client";

export interface UserDTO extends Omit<User, "passwordHash"> {}

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role?: Role;
  agencyId?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  phone?: string;
  role?: Role;
  agencyId?: string;
  isActive?: boolean;
}
