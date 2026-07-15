import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { TRegisterFcmTokenSchema } from '@/components/views/(protected)/notification/schema';

export const postRegisterFcmToken = async (
  payload: TRegisterFcmTokenSchema,
) => {
  const response = await agent(`/api/fcm/token`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const usePostRegisterFcmToken = () => {
  return useMutation({
    mutationFn: postRegisterFcmToken,
  });
};
