import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IBlcokListResponse {
  uuid: string;
  nickname: string;
  profileImageUrl: null | string;
}

// PARAMS TYPE
type TBlcokListParams = {
  page?: string;
  size?: string;
};

export const getBlockList = async (
  params: TBlcokListParams,
): Promise<IResponsePaged<IBlcokListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/account/block?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetBlockList = (params: TBlcokListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IBlcokListResponse>,
    Error,
    TInfiniteListResult<IBlcokListResponse>
  >({
    queryKey: queryKeys.mypage.followerList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return getBlockList({
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
