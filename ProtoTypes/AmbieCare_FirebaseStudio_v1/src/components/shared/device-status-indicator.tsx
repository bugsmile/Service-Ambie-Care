
import * as React from 'react';
import { cn } from '@/lib/utils';
import { type DeviceStatus } from '@/types/device';

interface DeviceStatusIndicatorProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';   // default: 'md'
  showLabel?: boolean;           // default: false
  pulse?: boolean;               // animate-pulse for ACTIVE, default: false
  className?: string;
}

const statusMap: Record<DeviceStatus, { color: string; label: string }> = {
  ACTIVE: { color: 'bg-green-500', label: '활성' },
  INACTIVE: { color: 'bg-red-500', label: '오프라인' },
  MAINTENANCE: { color: 'bg-yellow-500', label: '점검 중' },
};

const sizeMap: Record<NonNullable<DeviceStatusIndicatorProps['size']>, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

/**
 * [UI-004] Reusable status dot component
 * Pure presentational component
 */
export function DeviceStatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  pulse = false,
  className,
}: DeviceStatusIndicatorProps) {
  const { color, label } = statusMap[status];
  const sizeClass = sizeMap[size];
  const isPulseActive = pulse && status === 'ACTIVE';

  return (
    <div
      role="status"
      aria-label={`디바이스 상태: ${label}`}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span
        className={cn(
          'rounded-full',
          color,
          sizeClass,
          isPulseActive && 'animate-pulse'
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
