import { z } from "zod";

export const createCommentSchema = z.object({
  reportId: z.string(),
  userId: z.string(),
  message: z.string().min(1),
});
