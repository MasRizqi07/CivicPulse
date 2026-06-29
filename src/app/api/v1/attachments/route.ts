import { NextRequest, NextResponse } from "next/server";
import { attachmentRepository } from "@/modules/attachments/repositories/attachment.repository";
import { createAttachmentService } from "@/modules/attachments/services/create-attachment.service";
import { storage } from "@/server/storage";
import { auth } from "@/server/auth";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get("reportId");
    const attachmentId = searchParams.get("attachmentId");

    if (attachmentId) {
      // Return signed URL for specific attachment
      const signedUrl = await storage.getSignedAttachmentUrl(
        attachmentId,
        {
          id: session.user.id,
          role: session.user.role,
          agencyId: session.user.agencyId,
        }
      );
      return NextResponse.json({ data: { signedUrl } });
    }

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    const attachments = await attachmentRepository.findByReport(reportId);
    return NextResponse.json({ data: attachments });
  } catch (error: any) {
    logger.error({ error }, "Error fetching attachments");
    const message = error.message || "Failed to fetch attachments";
    const status = error.message?.includes("access") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const reportId = formData.get("reportId") as string;

    if (!file || !reportId) {
      return NextResponse.json({ error: "file and reportId are required" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `attachments/${fileName}`;

    const fileUrl = await storage.uploadFile(filePath, Buffer.from(buffer), file.type);

    const attachment = await createAttachmentService.execute(
      {
        reportId,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
      {
        id: session.user.id,
        role: session.user.role,
        agencyId: session.user.agencyId,
      }
    );

    return NextResponse.json({ data: attachment }, { status: 201 });
  } catch (error: any) {
    logger.error({ error }, "Error uploading attachment");
    const message = error.message || "Failed to upload attachment";
    const status = error.message?.includes("access") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
