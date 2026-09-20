import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getBuildings, getBuilding } from '../../services/buildingService';

export function useBuildingsQuery() {
  return useQuery({
    queryKey: queryKeys.buildings.all(),
    queryFn: () => getBuildings(),
  });
}

export function useBuildingDetailsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.buildings.detail(id),
    queryFn: () => getBuilding(id),
    enabled: Boolean(id),
  });
}
