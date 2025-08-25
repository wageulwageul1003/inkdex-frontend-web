import { useQuery } from '@tanstack/react-query';

import { nicknameDuplicateCheckKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

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

export const useGetNicknameDuplicateCheck = (nickname: string) =>
  useQuery({
    queryKey: [nicknameDuplicateCheckKey, nickname],
    queryFn: () => GetNicknameDuplicateCheck(nickname),
    enabled: nickname !== undefined && nickname.length >= 2, // 닉네임이 2자 이상일 때만 API 요청
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
