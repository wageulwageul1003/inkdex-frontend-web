import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCollectionReorderSchema } from '@/components/views/(public)/my-inkdex/_components/collection/schema';
import { ErrorData, agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export const patchCollectionReorder = async (
  payload: TCollectionReorderSchema,
) => {
  const response = await agent(`/api/collections/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchCollectionReorder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchCollectionReorder,

    onSuccess: async (response) => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.collection.list._def,
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('업데이트 실패:', error);
    },
  });
};
