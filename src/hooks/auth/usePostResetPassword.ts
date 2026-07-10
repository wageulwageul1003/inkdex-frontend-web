import { useMutation } from '@tanstack/react-query';

import { TResetPasswordSchema } from '@/components/views/(no-protected)/find-password/schema';
import { ErrorData, agent } from '@/utils/fetch';

export const postResetPassword = async (params: TResetPasswordSchema) => {
  const response = await agent(`/api/account/find-password`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostResetPassword = () => {
  return useMutation({
    mutationFn: postResetPassword,

    onSuccess: async (response) => {},
    onError: (error: ErrorData) => {},
  });
};
