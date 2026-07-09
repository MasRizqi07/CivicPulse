import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReportService } from '../create-report.service';
import { reportRepository } from '../../repositories/report.repository';
import { notificationQueue, auditLogQueue } from '@/server/queue';
import logger from '@/lib/logger';
import type { ReportCategory, Priority } from '@prisma/client';
import db from '@/server/db';

// Mock dependencies
vi.mock('@/server/db');
vi.mock('../../repositories/report.repository');
vi.mock('@/server/queue');
vi.mock('@/lib/logger');

describe('CreateReportService', () => {
  const mockCitizenId = 'citizen-1';
  const mockLocation = {
    id: 'location-1',
    latitude: -6.2088,
    longitude: 106.8456,
    address: 'Jl. Test 123',
    district: 'District',
    city: 'City',
    province: 'Province',
    postalCode: '12345',
  };

  const mockAgency = {
    id: 'agency-1',
    name: 'Test Agency',
    isActive: true,
  };

  const mockReport = {
    id: 'report-1',
    reportNumber: 'RPT-2026-001',
    title: 'Test Report',
    description: 'Test Description',
    category: 'INFRASTRUCTURE',
    priority: 'HIGH',
    citizenId: mockCitizenId,
    agencyId: mockAgency.id,
    locationId: mockLocation.id,
    status: 'SUBMITTED',
  };

  const mockCreateReportDto = {
    title: 'Test Report',
    description: 'Test Description',
    category: 'INFRASTRUCTURE' as ReportCategory,
    priority: 'HIGH' as Priority,
    latitude: -6.2088,
    longitude: 106.8456,
    address: 'Jl. Test 123',
    district: 'District',
    city: 'City',
    province: 'Province',
    postalCode: '12345',
    attachments: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a report', async () => {
    const mockTx = {
      location: { create: vi.fn().mockResolvedValue(mockLocation) },
      agency: { findFirst: vi.fn().mockResolvedValue(mockAgency) },
      report: { create: vi.fn().mockResolvedValue(mockReport) },
      reportAttachment: { createMany: vi.fn().mockResolvedValue({}) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    vi.mocked(reportRepository.generateReportNumber).mockResolvedValue('RPT-2026-001');
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);
    vi.mocked(auditLogQueue.add).mockResolvedValue({} as any);

    const service = new CreateReportService();
    const result = await service.execute(mockCitizenId, mockCreateReportDto);

    expect(result).toBeDefined();
    expect(logger.info).toHaveBeenCalled();
    expect(notificationQueue.add).toHaveBeenCalledWith('report-created', { reportId: result.id });
    expect(auditLogQueue.add).toHaveBeenCalledWith('report-created', { reportId: result.id });
  });

  it('should throw error when no active agency is available', async () => {
    const mockTx = {
      location: { create: vi.fn().mockResolvedValue(mockLocation) },
      agency: { findFirst: vi.fn().mockResolvedValue(null) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    const service = new CreateReportService();
    
    await expect(service.execute(mockCitizenId, mockCreateReportDto)).rejects.toThrow('No active agency available');
  });

  it('should create report with attachments', async () => {
    const dtoWithAttachments = {
      ...mockCreateReportDto,
      category: 'INFRASTRUCTURE' as ReportCategory,
      priority: 'HIGH' as Priority,
      attachments: [
        {
          fileName: 'test.jpg',
          fileUrl: 'https://example.com/test.jpg',
          fileSize: 1024,
          mimeType: 'image/jpeg',
        },
      ],
    };

    const mockTx = {
      location: { create: vi.fn().mockResolvedValue(mockLocation) },
      agency: { findFirst: vi.fn().mockResolvedValue(mockAgency) },
      report: { create: vi.fn().mockResolvedValue(mockReport) },
      reportAttachment: { createMany: vi.fn().mockResolvedValue({ count: 1 }) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    vi.mocked(reportRepository.generateReportNumber).mockResolvedValue('RPT-2026-001');
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);
    vi.mocked(auditLogQueue.add).mockResolvedValue({} as any);

    const service = new CreateReportService();
    const result = await service.execute(mockCitizenId, dtoWithAttachments);

    expect(result).toBeDefined();
  });
});
