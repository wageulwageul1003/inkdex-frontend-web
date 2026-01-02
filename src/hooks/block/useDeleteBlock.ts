import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteBlockKey, blockListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteBlock = async (params: { publicId: string }) => {
  const response = await agent(`/api/v1/users/blocks/${params.publicId}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlock,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteBlockKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [blockListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
