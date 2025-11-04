import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { TRegisterStep4Schema } from '@/components/views/(no-protected)/register/schema';
import { registerKey } from '@/constants/queryKeys';
import { CERTIFICATION_TOKEN } from '@/constants/tokens';
import { ErrorData, agent } from '@/utils/fetch';

export const postRegister = async (payload: TRegisterStep4Schema) => {
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

  const response = await agent(`/api/v1/auth/signup`, options);
  return response;
};

export const usePostRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRegister,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [registerKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
