import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { TResetPasswordSchema } from '@/components/views/(protected)/preferences/account/schema';

export const patchResetPassword = async (payload: TResetPasswordSchema) => {
  const response = await agent(`/api/account/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchResetPassword = () => {
  return useMutation({
    mutationFn: patchResetPassword,
  });
};
