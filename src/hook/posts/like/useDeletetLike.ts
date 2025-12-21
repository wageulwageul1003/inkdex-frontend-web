import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteLikeKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteLike = async (params: { postId: string }) => {
  const response = await agent(`/api/v1/posts/${params.postId}/like`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeletetLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLike,

    onSuccess: async (response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [deleteLikeKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
