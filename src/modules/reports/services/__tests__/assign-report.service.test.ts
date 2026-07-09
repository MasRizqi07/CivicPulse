import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignReportService } from '../assign-report.service';
import { assertOwnerOrAgency, ForbiddenError } from '@/server/authz';
import { createHistoryService } from '@/modules/histories/services/create-history.service';
import { notificationQueue } from '@/server/queue';
import logger from '@/lib/logger';
import type { Role } from '@prisma/client';
import db from '@/server/db';

// Mock dependencies
vi.mock('@/server/db');
vi.mock('@/server/authz');
vi.mock('@/modules/histories/services/create-history.service');
vi.mock('@/server/queue');
vi.mock('@/lib/logger');

describe('AssignReportService', () => {
  const mockUser = {
    id: 'user-1',
    role: 'OFFICER' as Role,
    agencyId: 'agency-1',
  };

  const mockOfficer = {
    id: 'officer-1',
    role: 'OFFICER' as Role,
    agencyId: 'agency-1',
    fullName: 'Test Officer',
  };

  const mockReport = {
    id: 'report-1',
    title: 'Test Report',
    status: 'SUBMITTED',
    citizenId: 'citizen-1',
    agencyId: 'agency-1',
    assignedOfficerId: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully assign report to officer when authorized', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });
    vi.mocked(createHistoryService.execute).mockResolvedValue({} as any);
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);

    vi.mocked(db.user.findUnique).mockResolvedValue(mockOfficer as any);
    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback({
        report: {
          update: vi.fn().mockResolvedValue({
            ...mockReport,
            assignedOfficerId: 'officer-1',
            status: 'ASSIGNED',
            citizen: { id: 'citizen-1', fullName: 'Test Citizen' },
            agency: { id: 'agency-1', name: 'Test Agency' },
            location: { id: 'loc-1', address: 'Test Address', city: 'Test City' },
            assignedOfficer: mockOfficer,
          }),
        },
        reportHistory: { create: vi.fn().mockResolvedValue({}) },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      });
    });

    const service = new AssignReportService();
    const result = await service.execute('report-1', mockUser, 'officer-1', 'Assign for investigation');

    expect(assertOwnerOrAgency).toHaveBeenCalledWith(mockUser, 'report-1');
    expect(notificationQueue.add).toHaveBeenCalledWith('report-assigned', {
      reportId: 'report-1',
      userId: 'officer-1',
    });
    expect(result.assignedOfficerId).toBe('officer-1');
    expect(result.status).toBe('ASSIGNED');
  });

  it('should throw ForbiddenError when citizen tries to assign report', async () => {
    const citizenUser = { ...mockUser, role: 'CITIZEN' as Role, agencyId: null };
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });

    const service = new AssignReportService();
    
    await expect(service.execute('report-1', citizenUser, 'officer-1')).rejects.toThrow(ForbiddenError);
  });

  it('should throw error when officer is not found', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });

    vi.mocked(db.user.findUnique).mockResolvedValue(null);

    const service = new AssignReportService();
    
    await expect(service.execute('report-1', mockUser, 'officer-1')).rejects.toThrow('Officer not found');
  });

  it('should throw error when user is not an officer', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });

    vi.mocked(db.user.findUnique).mockResolvedValue({
      ...mockOfficer,
      role: 'CITIZEN' as Role,
    } as any);

    const service = new AssignReportService();
    
    await expect(service.execute('report-1', mockUser, 'officer-1')).rejects.toThrow('User is not an officer');
  });

  it('should throw ForbiddenError when officer is not in same agency as report', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });

    vi.mocked(db.user.findUnique).mockResolvedValue({
      ...mockOfficer,
      agencyId: 'agency-2',
    } as any);

    const service = new AssignReportService();
    
    await expect(service.execute('report-1', mockUser, 'officer-1')).rejects.toThrow('Officer is not in the same agency as the report');
  });

  it('should create history record with default note when none provided', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });
    vi.mocked(createHistoryService.execute).mockResolvedValue({} as any);
    vi.mocked(notificationQueue.add).mockResolvedValue({} as any);

    vi.mocked(db.user.findUnique).mockResolvedValue(mockOfficer as any);
    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback({
        report: {
          update: vi.fn().mockResolvedValue({
            ...mockReport,
            assignedOfficerId: 'officer-1',
            status: 'ASSIGNED',
            citizen: { id: 'citizen-1', fullName: 'Test Citizen' },
            agency: { id: 'agency-1', name: 'Test Agency' },
            location: { id: 'loc-1', address: 'Test Address', city: 'Test City' },
            assignedOfficer: mockOfficer,
          }),
        },
        reportHistory: { create: vi.fn().mockResolvedValue({}) },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      });
    });

    const service = new AssignReportService();
    await service.execute('report-1', mockUser, 'officer-1');

    expect(db.$transaction).toHaveBeenCalled();
  });
});
