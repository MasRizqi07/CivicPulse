import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateReportStatusService } from '../update-report-status.service';
import { assertOwnerOrAgency, ForbiddenError } from '@/server/authz';
import { createHistoryService } from '@/modules/histories/services/create-history.service';
import { notificationQueue } from '@/server/queue';
import logger from '@/lib/logger';
import type { ReportStatus, Role } from '@prisma/client';
import db from '@/server/db';

// Mock dependencies
vi.mock('@/server/db');
vi.mock('@/server/authz');
vi.mock('@/modules/histories/services/create-history.service');
vi.mock('@/server/queue');
vi.mock('@/lib/logger');

describe('UpdateReportStatusService', () => {
  const mockUser = {
    id: 'user-1',
    role: 'OFFICER' as Role,
    agencyId: 'agency-1',
  };

  const mockReport = {
    id: 'report-1',
    title: 'Test Report',
    status: 'SUBMITTED' as ReportStatus,
    citizenId: 'citizen-1',
    agencyId: 'agency-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully update report status when authorized', async () => {
    const mockAssignedReport = { ...mockReport, status: 'ASSIGNED' as ReportStatus };
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockAssignedReport as any });
    vi.mocked(createHistoryService.execute).mockResolvedValue({} as any);
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);

    const mockTx = {
      report: {
        update: vi.fn().mockResolvedValue({
          ...mockAssignedReport,
          status: 'IN_PROGRESS',
          citizen: { id: 'citizen-1', fullName: 'Test Citizen' },
          agency: { id: 'agency-1', name: 'Test Agency' },
          location: { id: 'loc-1', address: 'Test Address', city: 'Test City' },
          assignedOfficer: null,
        }),
      },
      reportHistory: { create: vi.fn().mockResolvedValue({}) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    const service = new UpdateReportStatusService();
    const result = await service.execute('report-1', mockUser, 'IN_PROGRESS', 'Started working on it');

    expect(assertOwnerOrAgency).toHaveBeenCalledWith(mockUser, 'report-1');
    expect(notificationQueue.add).toHaveBeenCalledWith('report-status-updated', {
      reportId: 'report-1',
      userId: 'citizen-1',
      status: 'IN_PROGRESS',
    });
    expect(result).toBeDefined();
  });

  it('should throw ForbiddenError when citizen tries to update status', async () => {
    const citizenUser = { ...mockUser, role: 'CITIZEN' as Role, agencyId: null };
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });

    const service = new UpdateReportStatusService();
    
    await expect(service.execute('report-1', citizenUser, 'IN_PROGRESS')).rejects.toThrow(ForbiddenError);
  });

  it('should throw error for invalid status transition', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: { ...mockReport, status: 'CLOSED' } as any });

    const service = new UpdateReportStatusService();
    
    await expect(service.execute('report-1', mockUser, 'SUBMITTED')).rejects.toThrow('Invalid status transition');
  });

  it('should set resolvedAt when status is RESOLVED', async () => {
    const mockInProgressReport = { ...mockReport, status: 'IN_PROGRESS' as ReportStatus };
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockInProgressReport as any });
    vi.mocked(createHistoryService.execute).mockResolvedValue({} as any);
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);

    const mockTx = {
      report: {
        update: vi.fn().mockResolvedValue({
          ...mockInProgressReport,
          status: 'RESOLVED',
          resolvedAt: expect.any(Date),
          citizen: { id: 'citizen-1', fullName: 'Test Citizen' },
          agency: { id: 'agency-1', name: 'Test Agency' },
          location: { id: 'loc-1', address: 'Test Address', city: 'Test City' },
          assignedOfficer: null,
        }),
      },
      reportHistory: { create: vi.fn().mockResolvedValue({}) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    const service = new UpdateReportStatusService();
    const result = await service.execute('report-1', mockUser, 'RESOLVED');

    expect(result.resolvedAt).toBeDefined();
  });

  it('should set closedAt when status is CLOSED', async () => {
    const mockResolvedReport = { ...mockReport, status: 'RESOLVED' as ReportStatus };
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockResolvedReport as any });
    vi.mocked(createHistoryService.execute).mockResolvedValue({} as any);
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);

    const mockTx = {
      report: {
        update: vi.fn().mockResolvedValue({
          ...mockResolvedReport,
          status: 'CLOSED',
          closedAt: expect.any(Date),
          citizen: { id: 'citizen-1', fullName: 'Test Citizen' },
          agency: { id: 'agency-1', name: 'Test Agency' },
          location: { id: 'loc-1', address: 'Test Address', city: 'Test City' },
          assignedOfficer: null,
        }),
      },
      reportHistory: { create: vi.fn().mockResolvedValue({}) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    const service = new UpdateReportStatusService();
    const result = await service.execute('report-1', mockUser, 'CLOSED');

    expect(result.closedAt).toBeDefined();
  });
});
