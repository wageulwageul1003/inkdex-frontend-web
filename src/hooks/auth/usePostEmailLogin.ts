import { useMutation } from '@tanstack/react-query';

import { TEmailLoginSchema } from '@/components/views/(no-protected)/email-login/schema';
import { agent } from '@/utils/fetch';

export const postEmailLogin = async (params: TEmailLoginSchema) => {
  const response = await agent(`/api/account/login`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostEmailLogin = () => {
  return useMutation({
    mutationFn: postEmailLogin,
  });
};
