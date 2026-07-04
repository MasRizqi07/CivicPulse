import React from 'react';
import { Badge } from './Badge';
import { CheckCircle, Clock, AlertCircle, XCircle, Archive } from 'lucide-react';
import type { ReportStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: ReportStatus;
}

const statusConfig: Record<ReportStatus, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; icon: React.ReactNode; label: string }> = {
  DRAFT: { variant: 'default', icon: <Clock className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Draft' },
  SUBMITTED: { variant: 'info', icon: <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Submitted' },
  ASSIGNED: { variant: 'warning', icon: <Clock className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Assigned' },
  IN_PROGRESS: { variant: 'warning', icon: <AlertCircle className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'In Progress' },
  RESOLVED: { variant: 'success', icon: <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Resolved' },
  CLOSED: { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Closed' },
  REJECTED: { variant: 'danger', icon: <XCircle className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Rejected' },
  ARCHIVED: { variant: 'default', icon: <Archive className="w-3 h-3 mr-1" aria-hidden="true" />, label: 'Archived' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} aria-label={`Status: ${config.label}`}>
      {config.icon}
      <span className="sr-only">{config.label}</span>
      {config.label}
    </Badge>
  );
};
