import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { TRegisterStep1Schema } from '@/components/views/(no-protected)/register/schema';
import { confirmEmailKey } from '@/constants/queryKeys';
import { CERTIFICATION_TOKEN } from '@/constants/tokens';
import { ErrorData, agent } from '@/utils/fetch';

export const postConfirmEmail = async (payload: TRegisterStep1Schema) => {
  // Get the certification token from cookies
  const certificationToken = Cookies.get(CERTIFICATION_TOKEN);

  // Create options for the agent function
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
  };

  // Add the certification token to headers if it exists
  if (certificationToken) {
    // Initialize headers if not already present
    if (!options.headers) {
      options.headers = {};
    }
    // Add the Authorization header with the certification token
    // This will be properly merged in the agent function
    (options.headers as Record<string, string>)['Authorization'] =
      `Bearer ${certificationToken}`;
  }

  const response = await agent(`/api/v1/auth/confirm-email`, options);
  return response;
};

export const usePostConfirmEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postConfirmEmail,

    onSuccess: async (response) => {
      if (response?.data?.content) {
        Cookies.set(CERTIFICATION_TOKEN, response.data.content);
      }

      await queryClient.invalidateQueries({
        queryKey: [confirmEmailKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
