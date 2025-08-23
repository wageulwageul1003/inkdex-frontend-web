import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TEmailLoginSchema } from '@/components/views/(no-protected)/email-login/schema';
import { emailLoginKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postEmailLogin = async (params: TEmailLoginSchema) => {
  const response = await agent(`/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostEmailLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEmailLogin,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [emailLoginKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
