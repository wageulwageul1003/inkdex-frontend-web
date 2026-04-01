import { useQuery } from '@tanstack/react-query';

import { postTopSummaryKey } from '@/constants/queryKeys';
import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IPostTopSummaryResponse {
  nickname: string;
  bio: null | string;
  profileImageUrl: null | string;
  followerCount: number;
  followingCount: number;
}

export const GetPostTopSummary = async (): Promise<
  IResponseDetail<IPostTopSummaryResponse>
> => {
  const data = await agent(`/api/mypage/summary`, {
    method: 'GET',
  });

  return data;
};

export const useGetPostTopSummary = () =>
  useQuery({
    queryKey: [postTopSummaryKey],
    queryFn: () => GetPostTopSummary(),
  });
