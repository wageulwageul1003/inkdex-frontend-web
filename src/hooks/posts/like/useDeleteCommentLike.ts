import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import {
  commentListKey,
  commentReplyListKey,
  deleteLikeKey,
} from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteCommentLike = async (params: { commentId: string }) => {
  const response = await agent(`/api/v1/comments/${params.commentId}/like`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteCommentLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCommentLike,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteLikeKey],
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
