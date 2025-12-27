import { useInfiniteQuery } from '@tanstack/react-query';

import { followingListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFollowingListResponse {
  id: string;
  userName: string;
  nickname: string;
  profileImageUrl: string;
}

// PARAMS TYPE
type TFollowingListParams = {
  page?: string;
  size?: string;
};

export const GetFollowingList = async (
  params: TFollowingListParams,
): Promise<IResponsePaged<IFollowingListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/users/follwers/followings?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetFollowingList = (params: TFollowingListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IFollowingListResponse>,
    Error,
    TInfiniteListResult<IFollowingListResponse>
  >({
    queryKey: [followingListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetFollowingList({ ...params, page: String(pageParam) }),
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
