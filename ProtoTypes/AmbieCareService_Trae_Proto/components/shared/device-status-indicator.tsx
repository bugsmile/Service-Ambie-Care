/**
 * components/shared/device-status-indicator.tsx
 * Reusable Device Status Indicator Component
 * - Displays a colored dot representing the device's status.
 * - Supports different sizes, labels, and pulse animation.
 * - Ensures accessibility with proper ARIA attributes.
 */

import { DeviceStatus } from "@/types/device";
import { cn } from "@/lib/utils";

interface DeviceStatusIndicatorProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';   // default: 'md'
  showLabel?: boolean;           // default: false
  pulse?: boolean;               // animate-pulse for ACTIVE, default: false
}

const statusConfig = {
  ACTIVE: {
    color: "bg-green-500",
    label: "활성",
  },
  INACTIVE: {
    color: "bg-red-500",
    label: "오프라인",
  },
  MAINTENANCE: {
    color: "bg-yellow-500",
    label: "점검 중",
  },
};

const sizeConfig = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function DeviceStatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  pulse = false,
}: DeviceStatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div
      role="status"
      aria-label={`디바이스 상태: ${config.label}`}
      className="inline-flex items-center gap-2"
    >
      <span
        className={cn(
          "rounded-full",
          config.color,
          sizeClass,
          pulse && status === 'ACTIVE' && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
}
