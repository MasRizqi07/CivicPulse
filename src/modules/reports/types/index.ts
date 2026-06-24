import type { Report, ReportStatus, Priority, ReportCategory } from "@prisma/client";

// Report types
export type ReportWithRelations = Report & {
  citizen: { id: string; fullName: string; email: string };
  agency: { id: string; name: string };
  location: { id: string; address: string; city: string };
  assignedOfficer?: { id: string; fullName: string };
  attachments?: { id: string; fileName: string; fileUrl: string }[];
  comments?: { id: string; message: string; user: { id: string; fullName: string }; createdAt: Date }[];
};

// DTOs
export interface CreateReportDto {
  title: string;
  description: string;
  category: ReportCategory;
  priority?: Priority;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  city: string;
  province: string;
  postalCode?: string;
  attachments?: { fileName: string; fileUrl: string; fileSize: number; mimeType: string }[];
}

export interface UpdateReportDto {
  title?: string;
  description?: string;
  category?: ReportCategory;
  priority?: Priority;
  status?: ReportStatus;
  assignedOfficerId?: string;
}
