import { NextRequest, NextResponse } from "next/server";
import { attachmentRepository } from "@/modules/attachments/repositories/attachment.repository";
import { createAttachmentService } from "@/modules/attachments/services/create-attachment.service";
import { storage } from "@/server/storage";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get("reportId");
    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    const attachments = await attachmentRepository.findByReport(reportId);
    return NextResponse.json({ data: attachments });
  } catch (error) {
    logger.error({ error }, "Error fetching attachments");
    return NextResponse.json({ error: "Failed to fetch attachments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const reportId = formData.get("reportId") as string;
    const uploadedBy = formData.get("uploadedBy") as string;

    if (!file || !reportId || !uploadedBy) {
      return NextResponse.json({ error: "file, reportId and uploadedBy are required" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `attachments/${fileName}`;

    const fileUrl = await storage.uploadFile(filePath, Buffer.from(buffer), file.type);

    const attachment = await createAttachmentService.execute({
      reportId,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy,
    });

    return NextResponse.json({ data: attachment }, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Error uploading attachment");
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 });
  }
}
