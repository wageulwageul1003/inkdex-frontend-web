import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IPostListResponse } from '../home/useGetPostsList';

import { myInkdexFeedListKey } from '@/constants/queryKeys';
import { IResponse, IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyInkdexFeedListResponse {
  year: string;
  month: string;
  posts: IPostListResponse[];
}

// PARAMS TYPE
type TGetMyInkdexFeedListParams = {
  startAt?: string | null;
  endAt?: string | null;
};

export const GetMyInkdexFeedList = async (
  params: TGetMyInkdexFeedListParams,
): Promise<IResponsePaged<IMyInkdexFeedListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.startAt) queryParams.set('startAt', params.startAt);
  if (params.endAt) queryParams.set('endAt', params.endAt);

  const url = `/api/mypage/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyInkdexFeedList = (
  params: TGetMyInkdexFeedListParams,
): UseQueryResult<IResponse<IMyInkdexFeedListResponse>> =>
  useQuery({
    queryKey: [myInkdexFeedListKey, params],
    queryFn: () => GetMyInkdexFeedList(params),
  });
