import { useMutation } from '@tanstack/react-query';

import { TInquirySchema } from '@/components/views/(protected)/preferences/inquiry/scheme';
import { agent } from '@/utils/fetch';

export const postInquiry = async (payload: TInquirySchema) => {
  const response = await agent(`/api/inquiry`, {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
    }),
  });

  return response;
};

export const usePostInquiry = () => {
  return useMutation({
    mutationFn: postInquiry,
  });
};
