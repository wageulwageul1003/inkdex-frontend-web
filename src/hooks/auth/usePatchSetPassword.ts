import { useMutation } from '@tanstack/react-query';

import { TSetPasswordSchema } from '@/components/views/(protected)/preferences/account/schema';
import { agent } from '@/utils/fetch';

export const patchSetPassword = async (payload: TSetPasswordSchema) => {
  const response = await agent(`/api/account/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchSetPassword = () => {
  return useMutation({
    mutationFn: patchSetPassword,
  });
};
