import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import {
  commentListKey,
  commentReplyListKey,
  likeKey,
} from '@/constants/queryKeys';
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [likeKey],
      });

      await queryClient.invalidateQueries({
        queryKey: [commentListKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [commentReplyListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
