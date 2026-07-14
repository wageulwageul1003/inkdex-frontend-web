import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface ICollectionListResponse {
  uuid: string;
  name: string;
  imageUrl: string;
  priority: number;
  createdAt: string;
  postsCount: number;
}

// PARAMS TYPE
type TGetCollectionListParams = {
  page?: string;
  size?: string;
  accountUuid?: string;
};

export const GetCollectionList = async (
  params: TGetCollectionListParams,
): Promise<IResponsePaged<ICollectionListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.accountUuid) queryParams.set('accountUuid', params.accountUuid);

  const url = `/api/collections?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetCollectionList = (params: TGetCollectionListParams) => {
  return useInfiniteQuery<
    IResponsePaged<ICollectionListResponse>,
    Error,
    TInfiniteListResult<ICollectionListResponse>
  >({
    queryKey: queryKeys.collection.list(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetCollectionList({
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
