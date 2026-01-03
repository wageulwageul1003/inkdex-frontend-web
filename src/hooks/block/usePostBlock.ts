import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { blockKey, blockListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postBlock = async (params: { publicId: string }) => {
  const response = await agent(`/api/v1/users/blocks/${params.publicId}`, {
    method: 'POST',
  });

  return response;
};

export const usePostBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postBlock,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [blockKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [blockListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
