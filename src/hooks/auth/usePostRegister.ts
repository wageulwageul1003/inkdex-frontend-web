import { useMutation } from '@tanstack/react-query';

import { TRegisterSchema } from '@/components/views/(no-protected)/register/schema';
import { agent } from '@/utils/fetch';

export const postRegister = async (payload: TRegisterSchema) => {
  const response = await agent(`/api/account`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const usePostRegister = () => {
  return useMutation({
    mutationFn: postRegister,
  });
};
