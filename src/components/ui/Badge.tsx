import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-status-draft text-white border-status-draft',
      success: 'bg-status-resolved text-white border-status-resolved',
      warning: 'bg-status-assigned text-white border-status-assigned',
      danger: 'bg-status-rejected text-white border-status-rejected',
      info: 'bg-status-submitted text-white border-status-submitted',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variants[variant],
          className
        )}
        role="status"
        aria-label={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
