import { useMutation, useQueryClient } from '@tanstack/react-query';

import { nicknameDuplicateCheckKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent, ErrorData } from '@/utils/fetch';

export interface INicknameDuplicateCheckResponse {
  id: string;
  content: string;
}

export const GetNicknameDuplicateCheck = async (
  nickname: string,
): Promise<IResponse<INicknameDuplicateCheckResponse>> => {
  const data = await agent(
    `/api/v1/account/nickname-duplicate-check?nickname=${nickname}`,
    {
      method: 'GET',
    },
  );

  return data;
};

export const useGetNicknameDuplicateCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) => GetNicknameDuplicateCheck(nickname),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [nicknameDuplicateCheckKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
