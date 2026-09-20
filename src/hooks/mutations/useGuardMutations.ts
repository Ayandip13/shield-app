import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  createGuard,
  updateGuard,
  updateGuardStatus,
} from '../../services/guardService';
import { CreateGuardPayload, UpdateGuardPayload } from '../../types/guard';

export function useCreateGuardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuardPayload) => createGuard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateGuardMutation(guardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateGuardPayload) => updateGuard(guardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.detail(guardId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateGuardStatusMutation(guardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isActive: boolean) => updateGuardStatus(guardId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.guards.detail(guardId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
