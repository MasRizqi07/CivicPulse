import { commentRepository } from "../repositories/comment.repository";
import logger from "@/lib/logger";
import { assertOwnerOrAgency } from "@/server/authz";
import type { CreateCommentDTO } from "../types";
import type { Role } from "@prisma/client";

export class CreateCommentService {
  async execute(data: CreateCommentDTO, user: { id: string; role: Role; agencyId: string | null }) {
    logger.info("Creating comment", { reportId: data.reportId, userId: user.id });

    // Check authorization - user must have access to the report
    await assertOwnerOrAgency(user, data.reportId);

    const comment = await commentRepository.create({
      report: { connect: { id: data.reportId } },
      user: { connect: { id: user.id } },
      message: data.message,
    });

    logger.info("Comment created successfully", { commentId: comment.id });
    return comment;
  }
}

export const createCommentService = new CreateCommentService();
