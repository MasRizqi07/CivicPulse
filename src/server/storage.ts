import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import db from "./db";

// Initialize S3 client
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET_NAME = process.env.S3_BUCKET || "civicpulse";

export const storage = {
  async uploadFile(
    key: string,
    body: Buffer | string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `${process.env.S3_ENDPOINT || "http://localhost:9000"}/${BUCKET_NAME}/${key}`;
  },

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  /**
   * Get a signed URL for an attachment with authorization check
   * Verifies the user has access to the report before generating the URL
   */
  async getSignedAttachmentUrl(
    attachmentId: string,
    user: { id: string; role: string; agencyId: string | null },
    expiresIn: number = 900 // 15 minutes default
  ): Promise<string> {
    // Fetch attachment with report to check authorization
    const attachment = await db.reportAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        report: {
          select: {
            id: true,
            citizenId: true,
            agencyId: true,
          },
        },
      },
    });

    if (!attachment) {
      throw new Error("Attachment not found");
    }

    const report = attachment.report;

    // Authorization check
    if (user.role === "SUPER_ADMIN") {
      // Admin can access all
    } else if (user.role === "CITIZEN") {
      // Citizens can only access their own reports
      if (report.citizenId !== user.id) {
        throw new Error("You do not have access to this attachment");
      }
    } else if (user.role === "OFFICER") {
      // Officers can access reports in their agency
      if (!user.agencyId || report.agencyId !== user.agencyId) {
        throw new Error("You do not have access to this attachment");
      }
    } else {
      throw new Error("You do not have access to this attachment");
    }

    // Extract key from fileUrl
    // URL format: http://localhost:9000/bucket/key
    const urlParts = attachment.fileUrl.split("/");
    const key = urlParts.slice(-2).join("/"); // bucket/key

    return await this.getPresignedUrl(key, expiresIn);
  },

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  },
};
