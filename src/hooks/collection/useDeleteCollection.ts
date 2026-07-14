import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { ErrorData, agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
        queryKey: queryKeys.collection.list._def,
      });
    },
    onError: (error: ErrorData) => {},
  });
};
