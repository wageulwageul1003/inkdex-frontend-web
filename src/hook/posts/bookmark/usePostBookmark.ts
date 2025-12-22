import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { bookmarkKey, postsListKey } from '@/constants/queryKeys';
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [bookmarkKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
