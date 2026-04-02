import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { bookmarkKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postBookmark = async (params: { postUuid: string }) => {
  const response = await agent(`/api/posts/${params.postUuid}/bookmark`, {
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
      await queryClient.refetchQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
