import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { likeKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postLike = async (params: { postId: string }) => {
  const response = await agent(`/api/v1/posts/${params.postId}/like`, {
    method: 'POST',
  });

  return response;
};

export const usePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLike,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [likeKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
