import { useMutation } from '@tanstack/react-query';

import { ErrorData, agent } from '@/utils/fetch';
import { TFindPasswordSchema } from '@/components/views/(no-protected)/find-password/schema';

export const postResetPassword = async (params: TFindPasswordSchema) => {
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
