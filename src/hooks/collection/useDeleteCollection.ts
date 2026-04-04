import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { collectionListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteCollection = async (params: { collectionUuid: string }) => {
  const response = await agent(`/api/collections/${params.collectionUuid}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [collectionListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
