import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { myInkdexPostsCountKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IPostsCountResponse {
  categoryUuid: string;
  count: number;
}

type TGetPostsCountParams = {
  startAt?: string | null;
  endAt?: string | null;
};

export const GetPostsCount = async (
  params: TGetPostsCountParams,
): Promise<IResponse<IPostsCountResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.startAt) queryParams.set('startAt', params.startAt);
  if (params.endAt) queryParams.set('endAt', params.endAt);

  const url = `/api/mypage/posts/count?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetPostsCount = (
  params: TGetPostsCountParams,
): UseQueryResult<IResponse<IPostsCountResponse>> =>
  useQuery({
    queryKey: [myInkdexPostsCountKey, params],
    queryFn: () => GetPostsCount(params),
  });
