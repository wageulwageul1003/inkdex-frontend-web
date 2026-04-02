import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TEditProfileSchema } from '@/components/views/(protected)/mypage/edit-profile/schema';
import { myProfileKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const patchProfile = async (payload: TEditProfileSchema) => {
  const response = await agent(`/api/account/profile`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchProfile,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [myProfileKey],
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('업데이트 실패:', error);
    },
  });
};
