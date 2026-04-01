import { useMutation } from '@tanstack/react-query';

import { TCollectionWriteSchema } from '@/components/views/(protected)/collection/schema';
import { agent } from '@/utils/fetch';

export const postCollection = async (payload: TCollectionWriteSchema) => {
  const response = await agent(`/api/collections`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostCollection = () => {
  return useMutation({
    mutationFn: postCollection,
  });
};
