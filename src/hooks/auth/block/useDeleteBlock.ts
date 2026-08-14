import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export type TBlockPayloadType = {
  blockedAccountUuid: string;
};

export const deleteBlock = async (payload: TBlockPayloadType) => {
  const response = await agent(`/api/account/block`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });

  return response;
};

export const useDeleteBlock = () => {
  return useMutation({
    mutationFn: deleteBlock,
  });
};
