// Reusable device status indicator component with accessibility support
import { DeviceStatus } from '../../../types/device';

interface DeviceStatusIndicatorProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

const STATUS_CONFIG = {
  ACTIVE: {
    color: 'bg-green-500',
    label: '활성',
  },
  INACTIVE: {
    color: 'bg-red-500',
    label: '오프라인',
  },
  MAINTENANCE: {
    color: 'bg-yellow-500',
    label: '점검 중',
  },
} as const;

const SIZE_CONFIG = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
} as const;

export function DeviceStatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  pulse = false,
}: DeviceStatusIndicatorProps) {
  const config = STATUS_CONFIG[status];
  const sizeClass = SIZE_CONFIG[size];
  const shouldPulse = pulse && status === 'ACTIVE';

  return (
    <div
      role="status"
      aria-label={`디바이스 상태: ${config.label}`}
      className="inline-flex items-center gap-2"
    >
      <span
        className={`
          ${sizeClass}
          ${config.color}
          ${shouldPulse ? 'animate-pulse' : ''}
          rounded-full
        `}
      />
      {showLabel && (
        <span className="text-sm text-gray-700">{config.label}</span>
      )}
    </div>
  );
}
