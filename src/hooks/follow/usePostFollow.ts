import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { followKey, followListKey, postsListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postFollow = async (targetUuid: string) => {
  const response = await agent(`/api/account/follow`, {
    method: 'POST',
    body: JSON.stringify({ targetUuid }),
  });

  return response;
};

export const usePostFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFollow,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [followKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [followListKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [postsListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
