import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TInquirySchema } from '@/components/views/(protected)/preferences/inquiry/scheme';
import { inquiryKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postInquiry = async (payload: TInquirySchema) => {
  const response = await agent(`/api/v1/inquiries`, {
    method: 'POST',
  });

  return response;
};

export const usePostInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postInquiry,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [inquiryKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
