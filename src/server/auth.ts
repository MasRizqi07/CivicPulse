import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      fullName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        defaultValue: "CITIZEN",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      agencyId: {
        type: "string",
        required: false,
      },
    },
  },
});
