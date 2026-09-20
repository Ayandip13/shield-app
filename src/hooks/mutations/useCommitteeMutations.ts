import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  createCommitteeMember,
  updateCommitteeMember,
  updateCommitteeStatus,
} from '../../services/committeeService';
import { CreateCommitteePayload, UpdateCommitteePayload } from '../../types/committee';

export function useCreateCommitteeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommitteePayload) => createCommitteeMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.committee.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateCommitteeMutation(memberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCommitteePayload) => updateCommitteeMember(memberId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.committee.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.committee.detail(memberId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}

export function useUpdateCommitteeStatusMutation(memberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isActive: boolean) => updateCommitteeStatus(memberId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.committee.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.committee.detail(memberId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
