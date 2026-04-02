import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCommentDepth1Schema } from '@/components/views/(protected)/comment/schema';
import { commentListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postComment = async (params: TCommentDepth1Schema) => {
  const response = await agent(`/api/posts/${params.postUuid}/comment`, {
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
      await queryClient.refetchQueries({
        queryKey: [commentListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
