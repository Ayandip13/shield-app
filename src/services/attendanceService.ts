import { request } from './apiClient';
import {
  AttendanceRecord,
  TodayAttendanceStatusResponse,
  AttendanceFilterParams,
} from '../types/attendance';

/**
 * Guard duty check-in
 */
export async function checkInGuard(): Promise<AttendanceRecord> {
  const response = await request<AttendanceRecord>('/attendance/check-in', {
    method: 'POST',
  });
  return response.data!;
}

/**
 * Guard duty check-out
 */
export async function checkOutGuard(notes?: string): Promise<AttendanceRecord> {
  const response = await request<AttendanceRecord>('/attendance/check-out', {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
  return response.data!;
}

/**
 * Get authenticated guard's attendance history
 */
export async function getGuardAttendanceHistory(
  from?: string,
  to?: string
): Promise<AttendanceRecord[]> {
  const queryParams = new URLSearchParams();
  if (from) queryParams.append('from', from);
  if (to) queryParams.append('to', to);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<AttendanceRecord[]>(`/attendance/me${queryString}`);
  return response.data || [];
}

/**
 * Get authenticated guard's today duty attendance status
 */
export async function getGuardTodayAttendance(): Promise<TodayAttendanceStatusResponse> {
  const response = await request<TodayAttendanceStatusResponse>('/attendance/me/today');
  return response.data!;
}

/**
 * Get attendance overview for Provider Admin
 */
export async function getProviderAttendance(
  filters: AttendanceFilterParams = {}
): Promise<AttendanceRecord[]> {
  const queryParams = new URLSearchParams();
  if (filters.buildingId) queryParams.append('buildingId', filters.buildingId);
  if (filters.guardId) queryParams.append('guardId', filters.guardId);
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.from) queryParams.append('from', filters.from);
  if (filters.to) queryParams.append('to', filters.to);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<AttendanceRecord[]>(`/attendance${queryString}`);
  return response.data || [];
}

/**
 * Get building attendance for Committee Member
 */
export async function getCommitteeAttendance(
  filters: { date?: string; from?: string; to?: string } = {}
): Promise<AttendanceRecord[]> {
  const queryParams = new URLSearchParams();
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.from) queryParams.append('from', filters.from);
  if (filters.to) queryParams.append('to', filters.to);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<AttendanceRecord[]>(`/attendance/building${queryString}`);
  return response.data || [];
}
