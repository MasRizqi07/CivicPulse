import { z } from "zod";
import { Priority, ReportCategory } from "@prisma/client";

export const createReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  category: z.nativeEnum(ReportCategory),
  priority: z.nativeEnum(Priority).optional().default(Priority.MEDIUM),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(5),
  district: z.string().min(2),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().optional(),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string().url(),
        fileSize: z.number().positive(),
        mimeType: z.string(),
      })
    )
    .optional(),
});
