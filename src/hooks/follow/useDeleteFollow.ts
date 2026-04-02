import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteFollowKey, followListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteFollow = async (targetUuid: string) => {
  const response = await agent(`/api/account/follow`, {
    method: 'DELETE',
    body: JSON.stringify({ targetUuid }),
  });

  return response;
};

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFollow,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteFollowKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [followListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
