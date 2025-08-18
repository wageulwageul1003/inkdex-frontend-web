import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { TVerifyEmailSchema } from '@/components/views/(no-protected)/register/schema';
import { verifyEmailKey } from '@/constants/queryKeys';
import { CERTIFICATION_TOKEN } from '@/constants/tokens';
import { ErrorData, agent } from '@/utils/fetch';

export const postVerifyEmail = async (params: TVerifyEmailSchema) => {
  const response = await agent(`/api/v1/auth/verify-email`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });
  return response;
};

export const usePostVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postVerifyEmail,

    onSuccess: async (response) => {
      if (response?.data?.content) {
        Cookies.set(CERTIFICATION_TOKEN, response.data.content);
      }

      await queryClient.invalidateQueries({
        queryKey: [verifyEmailKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
