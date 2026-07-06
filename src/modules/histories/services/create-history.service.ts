import { historyRepository } from "../repositories/history.repository";
import logger from "@/lib/logger";
import type { CreateHistoryDTO } from "../types";

export class CreateHistoryService {
  async execute(data: CreateHistoryDTO) {
    logger.info({ reportId: data.reportId, newStatus: data.newStatus }, "Creating report history");

    const history = await historyRepository.create({
      report: { connect: { id: data.reportId } },
      actor: { connect: { id: data.actorId } },
      oldStatus: data.oldStatus,
      newStatus: data.newStatus,
      note: data.note,
    });

    logger.info({ historyId: history.id }, "Report history created successfully");
    return history;
  }
}

export const createHistoryService = new CreateHistoryService();
