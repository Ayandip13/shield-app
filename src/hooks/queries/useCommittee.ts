import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  getCommitteeMembers,
  getCommitteeMember,
  getMyCommitteeProfile,
} from '../../services/committeeService';

export function useCommitteeMembersQuery(buildingId?: string) {
  return useQuery({
    queryKey: queryKeys.committee.list({ buildingId }),
    queryFn: () => getCommitteeMembers(buildingId),
  });
}

export function useCommitteeMemberDetailsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.committee.detail(id),
    queryFn: () => getCommitteeMember(id),
    enabled: Boolean(id),
  });
}

export function useMyCommitteeProfileQuery() {
  return useQuery({
    queryKey: queryKeys.committee.me(),
    queryFn: () => getMyCommitteeProfile(),
  });
}
