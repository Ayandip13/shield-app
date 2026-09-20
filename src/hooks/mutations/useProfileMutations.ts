import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { updateProfile, changePassword } from '../../services/profileService';
import { UpdateProfilePayload, ChangePasswordPayload } from '../../types/profile';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}
