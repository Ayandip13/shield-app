import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  getGuardAttendanceHistory,
  getGuardTodayAttendance,
  getProviderAttendance,
  getCommitteeAttendance,
} from '../../services/attendanceService';
import { AttendanceFilterParams } from '../../types/attendance';

export function useGuardAttendanceHistoryQuery(from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.attendance.meHistory(from, to),
    queryFn: () => getGuardAttendanceHistory(from, to),
  });
}

export function useGuardTodayAttendanceQuery() {
  return useQuery({
    queryKey: queryKeys.attendance.meToday(),
    queryFn: () => getGuardTodayAttendance(),
  });
}

export function useProviderAttendanceQuery(filters: AttendanceFilterParams = {}) {
  return useQuery({
    queryKey: queryKeys.attendance.provider(filters),
    queryFn: () => getProviderAttendance(filters),
  });
}

export function useCommitteeAttendanceQuery(filters: { date?: string; from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.attendance.committee(filters),
    queryFn: () => getCommitteeAttendance(filters),
  });
}
