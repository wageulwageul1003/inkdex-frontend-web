import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IFollowerListResponse {
  createdAt: string;
  account: {
    uuid: string;
    nickname: string;
    profileImageUrl: null | string;
  };
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

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/account/follow/followers?${queryParams.toString()}`;

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
    queryKey: queryKeys.mypage.followerList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetFollowerList({
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
