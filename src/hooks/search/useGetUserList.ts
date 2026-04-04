import { useInfiniteQuery } from '@tanstack/react-query';

import { userListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IUserListResponse {
  id: string;
  userName: string;
  nickname: string;
  profileImageUrl: string;
  bio: string;
}

// PARAMS TYPE
type TGetUserPostsListParams = {
  searchKeyword?: string;
  page?: string;
  size?: string;
};

export const GetUserList = async (
  params: TGetUserPostsListParams,
): Promise<IResponsePaged<IUserListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.searchKeyword)
    queryParams.set('searchKeyword', params.searchKeyword);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/search/account?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetUserList = (params: TGetUserPostsListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IUserListResponse>,
    Error,
    TInfiniteListResult<IUserListResponse>
  >({
    queryKey: [userListKey, params],
    enabled: !!params.searchKeyword,
    queryFn: ({ pageParam = 1 }) =>
      GetUserList({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined,

    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      paging: data.pages[0].data.paging,
    }),
  });
};
