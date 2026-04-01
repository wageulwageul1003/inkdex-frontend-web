import { useMutation } from '@tanstack/react-query';

import { TDeleteAccountSchema } from '@/components/views/(protected)/preferences/account/schema';
import { agent } from '@/utils/fetch';

export const postWithdrawAccount = async (payload: TDeleteAccountSchema) => {
  const response = await agent(`/api/account/withdraw`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostWithdrawAccount = () => {
  return useMutation({
    mutationFn: postWithdrawAccount,
  });
};
