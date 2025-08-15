import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TConfirmEmailSchema } from '@/components/views/(no-protected)/register/schema';
import { confirmEmailKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postConfirmEmail = async (params: TConfirmEmailSchema) => {
  const response = await agent(`/api/v1/auth/confirm-email`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });
  return response;
};

export const usePostConfirmEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postConfirmEmail,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [confirmEmailKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
