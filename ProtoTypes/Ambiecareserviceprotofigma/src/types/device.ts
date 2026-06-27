// Shared device status type used across Guardian and Admin portals
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

// User role types
export type UserRole = 'GUARDIAN' | 'FACILITY_ADMIN';

// User session type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
