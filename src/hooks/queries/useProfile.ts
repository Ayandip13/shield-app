import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getProfile } from '../../services/profileService';

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => getProfile(),
  });
}
