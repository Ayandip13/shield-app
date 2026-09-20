import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { createEntryLog, markEntryLogExit } from '../../services/entryLogService';
import { CreateEntryLogDto } from '../../types/entryLog';

export function useCreateEntryLogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEntryLogDto) => createEntryLog(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entryLogs.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useMarkEntryLogExitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markEntryLogExit(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entryLogs.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.entryLogs.detail(data._id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
