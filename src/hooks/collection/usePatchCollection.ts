import { useMutation } from '@tanstack/react-query';

import { TCollectionWriteSchema } from '@/components/views/(protected)/collection/schema';
import { agent } from '@/utils/fetch';

export const patchCollection = async (payload: TCollectionWriteSchema) => {
  const response = await agent(`/api/collections/${payload.uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePatchCollection = () => {
  return useMutation({
    mutationFn: patchCollection,
  });
};
