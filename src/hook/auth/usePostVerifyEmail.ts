import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TVerifyEmailSchema } from '@/components/views/(no-protected)/register/schema';
import { verifyEmailKey } from '@/constants/queryKeys';
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
      // Store otpToken in cookies if it exists in the response
      if (response?.data?.otpToken) {
        // Set cookie with 30 minutes expiration
        // Cookies.set(CERTIFICATION_TOKEN, response.data.otpToken, {
        //   expires: getThirtyMinutesFromNow(),
        // });
      }

      await queryClient.invalidateQueries({
        queryKey: [verifyEmailKey],
      });
    },
    onError: (error: ErrorData) => {
      // alert({
      //   title: '인증번호 전송에 실패했습니다.',
      //   cancelButton: null,
      // });
    },
  });
};
