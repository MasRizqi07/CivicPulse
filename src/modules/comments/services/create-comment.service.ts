import { commentRepository } from "../repositories/comment.repository";
import logger from "@/lib/logger";
import type { CreateCommentDTO } from "../types";

export class CreateCommentService {
  async execute(data: CreateCommentDTO) {
    logger.info("Creating comment", { reportId: data.reportId, userId: data.userId });

    const comment = await commentRepository.create({
      report: { connect: { id: data.reportId } },
      user: { connect: { id: data.userId } },
      message: data.message,
    });

    logger.info("Comment created successfully", { commentId: comment.id });
    return comment;
  }
}

export const createCommentService = new CreateCommentService();
