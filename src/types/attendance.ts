import { Building } from './building';

export interface AttendanceGuardInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  employeeId?: string;
  designation?: string;
}

export interface AttendanceRecord {
  _id: string;
  guardId: AttendanceGuardInfo | string;
  providerId: string;
  buildingId: Building | string;
  date: string; // YYYY-MM-DD
  checkIn: string; // ISO date string
  checkOut?: string | null;
  status: 'present';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DutyState = 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'CHECKED_OUT';

export interface TodayAttendanceStatusResponse {
  state: DutyState;
  attendance: AttendanceRecord | null;
  shift: {
    startTime: string;
    endTime: string;
    isActive: boolean;
  };
  guard: {
    id: string;
    name: string;
    employeeId?: string;
    building?: Building;
  };
}

export interface AttendanceFilterParams {
  buildingId?: string;
  guardId?: string;
  date?: string;
  from?: string;
  to?: string;
}
