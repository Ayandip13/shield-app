import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { updateGuardShift } from '../../services/shiftService';
import { UpdateShiftDto } from '../../types/shift';

export function useUpdateGuardShiftMutation(guardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shiftData: UpdateShiftDto) => updateGuardShift(guardId, shiftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts.byGuard(guardId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.detail(guardId) });
    },
  });
}
