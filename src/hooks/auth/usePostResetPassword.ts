import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TResetPasswordSchema } from '@/components/views/(no-protected)/find-password/schema';
import { resetPasswordKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postResetPassword = async (params: TResetPasswordSchema) => {
  const response = await agent(`/api/v1/account/password-reset`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postResetPassword,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [resetPasswordKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
