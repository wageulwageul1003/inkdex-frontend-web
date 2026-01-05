import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { commentListKey, likeKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postCommentLike = async (params: { commentId: string }) => {
  const response = await agent(`/api/v1/comments/${params.commentId}/like`, {
    method: 'POST',
  });

  return response;
};

export const usePostCommentLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCommentLike,

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [likeKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [commentListKey, data.commentId],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
