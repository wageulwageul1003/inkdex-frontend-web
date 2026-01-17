import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { myInkdexPostsCountKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IPostsCountResponse {
  category: string;
  count: number;
}

type TGetPostsCountParams = {
  startDate: string | null;
  endDate: string | null;
};

export const GetPostsCount = async (
  params: TGetPostsCountParams,
): Promise<IResponse<IPostsCountResponse>> => {
  const data = await agent(
    params.startDate || params.endDate
      ? `/api/v1/me/posts/counts?startDate=${params.startDate}&endDate=${params.endDate}`
      : `/api/v1/me/posts/counts`,
    {
      method: 'GET',
    },
  );

  return data;
};

export const useGetPostsCount = (
  params: TGetPostsCountParams,
): UseQueryResult<IResponse<IPostsCountResponse>> =>
  useQuery({
    queryKey: [myInkdexPostsCountKey, params],
    queryFn: () => GetPostsCount(params),
  });
