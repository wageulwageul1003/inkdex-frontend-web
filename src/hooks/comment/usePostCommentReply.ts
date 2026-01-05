import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCommentSchema } from '@/components/views/(protected)/comment/schema';
import { commentReplyListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postCommentReply = async (params: TCommentSchema) => {
  const response = await agent(`/api/v1/comments/${params.commentId}/reply`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
    }),
  });

  return response;
};

export const usePostCommentReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCommentReply,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [commentReplyListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
