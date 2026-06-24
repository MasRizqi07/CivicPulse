import { historyRepository } from "../repositories/history.repository";
import logger from "@/lib/logger";
import type { CreateHistoryDTO } from "../types";

export class CreateHistoryService {
  async execute(data: CreateHistoryDTO) {
    logger.info("Creating report history", { reportId: data.reportId, newStatus: data.newStatus });

    const history = await historyRepository.create({
      report: { connect: { id: data.reportId } },
      actor: { connect: { id: data.actorId } },
      oldStatus: data.oldStatus,
      newStatus: data.newStatus,
      note: data.note,
    });

    logger.info("Report history created successfully", { historyId: history.id });
    return history;
  }
}

export const createHistoryService = new CreateHistoryService();
