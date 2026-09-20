import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getGuards, getGuard, getMyGuardProfile } from '../../services/guardService';

export function useGuardsQuery(buildingId?: string) {
  return useQuery({
    queryKey: queryKeys.guards.list({ buildingId }),
    queryFn: () => getGuards(buildingId),
  });
}

export function useGuardDetailsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.guards.detail(id),
    queryFn: () => getGuard(id),
    enabled: Boolean(id),
  });
}

export function useMyGuardProfileQuery() {
  return useQuery({
    queryKey: queryKeys.guards.me(),
    queryFn: () => getMyGuardProfile(),
  });
}
