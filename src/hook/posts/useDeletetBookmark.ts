import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteBookmarkKey, postsDetailKey } from '@/constants/queryKeys';
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

    onSuccess: async (response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [deleteBookmarkKey],
      });
      // Also invalidate the specific post detail to refresh the UI
      await queryClient.invalidateQueries({
        queryKey: [postsDetailKey, variables.postId],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
