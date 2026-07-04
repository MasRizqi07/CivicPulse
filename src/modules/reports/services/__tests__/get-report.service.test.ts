import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetReportService } from '../get-report.service';
import { reportRepository } from '../../repositories/report.repository';
import { assertOwnerOrAgency } from '@/server/authz';
import { ForbiddenError } from '@/server/authz';

// Mock dependencies
vi.mock('@/server/authz');
vi.mock('../../repositories/report.repository');

describe('GetReportService', () => {
  const mockUser = {
    id: 'user-1',
    role: 'CITIZEN' as const,
    agencyId: null,
  };

  const mockReport = {
    id: 'report-1',
    title: 'Test Report',
    description: 'Test Description',
    citizenId: 'user-1',
    attachments: [],
    comments: [],
    histories: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch a report when authorized', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });
    vi.mocked(reportRepository.findById).mockResolvedValue(mockReport as any);

    const service = new GetReportService();
    const result = await service.execute('report-1', mockUser);

    expect(assertOwnerOrAgency).toHaveBeenCalledWith(mockUser, 'report-1');
    expect(reportRepository.findById).toHaveBeenCalledWith('report-1', expect.any(Object));
    expect(result).toBeDefined();
  });

  it('should throw ForbiddenError when user is not authorized', async () => {
    vi.mocked(assertOwnerOrAgency).mockRejectedValue(
      new ForbiddenError('You do not have access to this report')
    );

    const service = new GetReportService();
    
    await expect(service.execute('report-1', mockUser)).rejects.toThrow(ForbiddenError);
  });

  it('should throw error when report is not found', async () => {
    vi.mocked(assertOwnerOrAgency).mockResolvedValue({ report: mockReport as any });
    vi.mocked(reportRepository.findById).mockResolvedValue(null);

    const service = new GetReportService();
    
    await expect(service.execute('report-1', mockUser)).rejects.toThrow('Report not found');
  });
});
