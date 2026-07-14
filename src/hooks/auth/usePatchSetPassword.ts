import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { TSetPasswordSchema } from '@/components/views/(protected)/preferences/account/schema';

export const patchResetPassword = async (payload: TSetPasswordSchema) => {
  const response = await agent(`/api/account/set-password`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchSetPassword = () => {
  return useMutation({
    mutationFn: patchResetPassword,
  });
};
