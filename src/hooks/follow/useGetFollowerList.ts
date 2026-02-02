import { useInfiniteQuery } from '@tanstack/react-query';

import { followListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFollowerListResponse {
  id: string;
  userName: string;
  nickname: string;
  profileImageUrl: string;
  following: boolean;
  bio: string;
}

// PARAMS TYPE
type TFollowerListParams = {
  page?: string;
  size?: string;
};

export const GetFollowerList = async (
  params: TFollowerListParams,
): Promise<IResponsePaged<IFollowerListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/me/followers?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetFollowerList = (params: TFollowerListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IFollowerListResponse>,
    Error,
    TInfiniteListResult<IFollowerListResponse>
  >({
    queryKey: [followListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetFollowerList({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined,

    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      paging: data.pages[data.pages.length - 1].data.paging,
    }),
  });
};
