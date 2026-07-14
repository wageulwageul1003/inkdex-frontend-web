import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IUserListResponse {
  uuid: string;
  nickname: string;
  email: string;
  profileImageUrl: null | string;
  bio: null | string;
  followerCount: number;
  isFollowing: boolean;
}

// PARAMS TYPE
type TGetUserPostsListParams = {
  page?: string;
  size?: string;
  searchKeyword?: string;
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
    queryKey: queryKeys.search.userList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetUserList({
        ...params,
        page: String(pageParam),
      });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const { page, number } = lastPage.data.paging;

      return page + 1 < number ? page + 1 : undefined;
    },

    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      paging: data.pages[data.pages.length - 1].data.paging,
    }),
  });
};
