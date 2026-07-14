import { useInfiniteQuery } from '@tanstack/react-query';

import { IPostListResponse } from '../home/useGetPostsList';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

// PARAMS TYPE
type TGetSpecificCollectionPostListParams = {
  collectionUuid: string;
  page?: string;
  size?: string;
};

export const GetSpecificCollectionPostList = async (
  params: TGetSpecificCollectionPostListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/collections/${params.collectionUuid}/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetSpecificCollectionPostList = (
  params: TGetSpecificCollectionPostListParams,
) => {
  return useInfiniteQuery<
    IResponsePaged<IPostListResponse>,
    Error,
    TInfiniteListResult<IPostListResponse>
  >({
    queryKey: queryKeys.collection.postList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetSpecificCollectionPostList({
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
