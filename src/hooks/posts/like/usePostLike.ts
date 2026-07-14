import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
      await queryClient.refetchQueries({
        queryKey: queryKeys.mypage.postList._def,
      });
    },
  });
};
