import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export type TPostVerifyEmailPayload = {
  email: string;
};

export const postVerifyEmail = async (payload: TPostVerifyEmailPayload) => {
  const response = await agent(`/api/account/send-code`, {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
    }),
  });
  return response;
};

export const usePostVerifyEmail = () => {
  return useMutation({
    mutationFn: postVerifyEmail,
  });
};
