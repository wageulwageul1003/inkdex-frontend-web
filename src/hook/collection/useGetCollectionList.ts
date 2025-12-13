import { useInfiniteQuery } from '@tanstack/react-query';

import { collectionListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICollectionListResponse {
  uuid: string;
  name: string;
}

// PARAMS TYPE
type TGetCollectionListParams = {
  page?: string;
  size?: string;
};

export const GetCollectionList = async (
  params: TGetCollectionListParams,
): Promise<IResponsePaged<ICollectionListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/collections?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetCollectionList = (params: TGetCollectionListParams) => {
  return useInfiniteQuery<IResponsePaged<ICollectionListResponse>>({
    queryKey: [collectionListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetCollectionList({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined;
    },
  });
};
