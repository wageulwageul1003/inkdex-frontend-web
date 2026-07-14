import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
        queryKey: queryKeys.other._def,
      });
    },
  });
};
