import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { checkInGuard, checkOutGuard } from '../../services/attendanceService';

export function useCheckInGuardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => checkInGuard(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useCheckOutGuardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notes?: string) => checkOutGuard(notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
