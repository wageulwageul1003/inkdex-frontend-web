import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { myInkdexFeedListKey, postsKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deletePosts = async (params: { publicId: string }) => {
  const response = await agent(`/api/v1/posts/${params.publicId}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeletePosts = (p0: { publicId: string | undefined }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePosts,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [postsKey],
      });
      await queryClient.refetchQueries({
        queryKey: [myInkdexFeedListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
