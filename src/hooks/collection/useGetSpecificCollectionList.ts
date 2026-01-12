import { useInfiniteQuery } from '@tanstack/react-query';

import { IPostListResponse } from '../home/useGetPostsList';

import { specificCollectionListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

// PARAMS TYPE
type TGetSpecificCollectionListParams = {
  collectionId: string;
  page?: string;
  size?: string;
};

export const GetSpecificCollectionList = async (
  params: TGetSpecificCollectionListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/collections/${params.collectionId}/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetSpecificCollectionList = (
  params: TGetSpecificCollectionListParams,
) => {
  return useInfiniteQuery<
    IResponsePaged<IPostListResponse>,
    Error,
    TInfiniteListResult<IPostListResponse>
  >({
    queryKey: [specificCollectionListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetSpecificCollectionList({ ...params, page: String(pageParam) }),
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
