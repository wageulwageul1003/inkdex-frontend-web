import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { bookmarkKey, postsDetailKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postBookmark = async (params: { postId: string }) => {
  const response = await agent(`/api/v1/bookmarks/${params.postId}`, {
    method: 'POST',
  });

  return response;
};

export const usePostBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postBookmark,

    onSuccess: async (response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [bookmarkKey],
      });
      // Also invalidate the specific post detail to refresh the UI
      await queryClient.invalidateQueries({
        queryKey: [postsDetailKey, variables.postId],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
