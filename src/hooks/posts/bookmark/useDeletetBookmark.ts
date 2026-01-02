import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteBookmarkKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteBookmark = async (params: { postId: string }) => {
  const response = await agent(`/api/v1/bookmarks/${params.postId}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeletetBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBookmark,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteBookmarkKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
