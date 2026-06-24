import type { ReportComment } from "@prisma/client";

export interface CommentDTO extends ReportComment {}

export interface CreateCommentDTO {
  reportId: string;
  userId: string;
  message: string;
}
