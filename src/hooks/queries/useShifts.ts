import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getGuardShift } from '../../services/shiftService';

export function useGuardShiftQuery(guardId: string) {
  return useQuery({
    queryKey: queryKeys.shifts.byGuard(guardId),
    queryFn: () => getGuardShift(guardId),
    enabled: Boolean(guardId),
  });
}
