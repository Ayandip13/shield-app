import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  createBuilding,
  updateBuilding,
  updateBuildingStatus,
} from '../../services/buildingService';
import { CreateBuildingPayload, UpdateBuildingPayload } from '../../types/building';

export function useCreateBuildingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuildingPayload) => createBuilding(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateBuildingMutation(buildingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBuildingPayload) => updateBuilding(buildingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.detail(buildingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateBuildingStatusMutation(buildingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isActive: boolean) => updateBuildingStatus(buildingId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.detail(buildingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
