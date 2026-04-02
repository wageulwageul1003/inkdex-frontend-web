import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { likeKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postLike = async (params: { postUuid: string }) => {
  const response = await agent(`/api/posts/${params.postUuid}/like`, {
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
      await queryClient.refetchQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
