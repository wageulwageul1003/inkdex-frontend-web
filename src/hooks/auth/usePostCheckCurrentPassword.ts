import { useMutation } from '@tanstack/react-query';

import { TCurrentPasswordSchema } from '@/components/views/(protected)/preferences/account/schema';
import { agent } from '@/utils/fetch';

export const postCheckCurrentPassword = async (
  payload: TCurrentPasswordSchema,
) => {
  const response = await agent(`/api/account/verify-password`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostCheckCurrentPassword = () => {
  return useMutation({
    mutationFn: postCheckCurrentPassword,
  });
};
