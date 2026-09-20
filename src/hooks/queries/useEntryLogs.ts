import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  getActiveEntryLogs,
  getEntryLogs,
  getEntryLogById,
} from '../../services/entryLogService';
import { EntryLogFilterParams } from '../../types/entryLog';

export function useActiveEntryLogsQuery(buildingId?: string) {
  return useQuery({
    queryKey: queryKeys.entryLogs.active(buildingId),
    queryFn: () => getActiveEntryLogs(buildingId),
    refetchInterval: 15000, // Background poll active entries every 15s for live gate status
  });
}

export function useEntryLogsQuery(filters: EntryLogFilterParams = {}) {
  return useQuery({
    queryKey: queryKeys.entryLogs.history(filters),
    queryFn: () => getEntryLogs(filters),
  });
}

export function useEntryLogDetailsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.entryLogs.detail(id),
    queryFn: () => getEntryLogById(id),
    enabled: Boolean(id),
  });
}
