import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { followKey, followListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postFollow = async (params: { publicId: string }) => {
  const response = await agent(`/api/v1/users/follows/${params.publicId}`, {
    method: 'POST',
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
    },
    onError: (error: ErrorData) => {},
  });
};
