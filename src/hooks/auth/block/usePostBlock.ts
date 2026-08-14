import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export type TBlockPayloadType = {
  blockedAccountUuid: string;
};

export const postBlock = async (payload: TBlockPayloadType) => {
  const response = await agent(`/api/account/block`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostBlock = () => {
  return useMutation({
    mutationFn: postBlock,
  });
};
