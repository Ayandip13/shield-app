import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  getDashboard,
  getGuardDashboard,
  getSecurityActivity,
} from '../../services/dashboardService';

export function useDashboardQuery(buildingId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(buildingId),
    queryFn: () => getDashboard(buildingId),
  });
}

export function useGuardDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.guard(),
    queryFn: () => getGuardDashboard(),
  });
}

export function useSecurityActivityQuery(buildingId?: string, limit = 20) {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(buildingId, limit),
    queryFn: () => getSecurityActivity(buildingId, limit),
  });
}
