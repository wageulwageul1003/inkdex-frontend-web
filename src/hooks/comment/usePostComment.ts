import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCommentSchema } from '@/components/views/(protected)/comment/schema';
import { commentListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postComment = async (params: TCommentSchema) => {
  const response = await agent(`/api/v1/posts/${params.publicId}/comment`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [commentListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
