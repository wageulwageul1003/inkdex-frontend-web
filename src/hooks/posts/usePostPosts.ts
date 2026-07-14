import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TWriteSchema } from '@/components/views/(protected)/posts/schema';
import { ErrorData, agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export const postRegister = async (paylaod: TWriteSchema) => {
  const response = await agent(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify(paylaod),
  });

  return response;
};

export const usePostPosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRegister,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.mypage.postList._def,
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('게시물 등록 실패:', error);
    },
  });
};
