import { Queue, Worker, Job } from "bullmq";
import redis from "./cache";
import logger from "@/lib/logger";
import { auditLogRepository } from "@/modules/audit-logs/repositories/audit-log.repository";

// Queue names
export const NOTIFICATION_QUEUE = "notifications";
export const ANALYTICS_QUEUE = "analytics";
export const AUDIT_LOG_QUEUE = "audit-logs";

// Initialize queues (type assertion for ioredis version mismatch)
export const notificationQueue = new Queue(NOTIFICATION_QUEUE, {
  connection: redis as any,
});

export const analyticsQueue = new Queue(ANALYTICS_QUEUE, {
  connection: redis as any,
});

export const auditLogQueue = new Queue(AUDIT_LOG_QUEUE, {
  connection: redis as any,
});

// Worker functions
const setupWorkers = () => {
  // Notification worker
  new Worker(
    NOTIFICATION_QUEUE,
    async (job: Job) => {
      logger.info(job.data, `Processing notification job: ${job.id}`);
      // In production, you'd send push notifications, emails, etc.
      logger.info(`Notification delivered to user ${job.data.userId}`);
    },
    { connection: redis as any }
  );

  // Analytics worker
  new Worker(
    ANALYTICS_QUEUE,
    async (job: Job) => {
      logger.info(job.data, `Processing analytics job: ${job.id}`);
      // Track events in your analytics system
    },
    { connection: redis as any }
  );

  // Audit log worker
  new Worker(
    AUDIT_LOG_QUEUE,
    async (job: Job) => {
      logger.info(job.data, `Processing audit log job: ${job.id}`);
      try {
        await auditLogRepository.create(job.data);
        logger.info(`Audit log created successfully: ${job.id}`);
      } catch (error) {
        logger.error({ error }, "Failed to create audit log");
        throw error;
      }
    },
    { connection: redis as any }
  );

  logger.info("Workers initialized");
};

// Initialize workers in non-serverless environments
if (typeof window === "undefined") {
  setupWorkers();
}

export { setupWorkers };
