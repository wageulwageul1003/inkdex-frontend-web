import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { ErrorData, agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
        queryKey: queryKeys.other._def,
      });
    },
    onError: (error: ErrorData) => {},
  });
};
