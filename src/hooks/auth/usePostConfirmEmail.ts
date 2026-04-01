import { useMutation } from '@tanstack/react-query';

import { TRegisterStep1Schema } from '@/components/views/(no-protected)/register/schema';
import { ErrorData, agent } from '@/utils/fetch';

export const postConfirmEmail = async (payload: TRegisterStep1Schema) => {
  const response = await agent(`/api/account/send-code/verify`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const usePostConfirmEmail = () => {
  return useMutation({
    mutationFn: postConfirmEmail,

    onSuccess: async (response) => {},
    onError: (error: ErrorData) => {},
  });
};
