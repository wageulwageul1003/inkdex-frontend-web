import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { IPostListResponse } from '../home/useGetPostsList';
import { queryKeys } from '@/constants/query-key';

// PARAMS TYPE
type TGetSearchPostsListParams = {
  page?: string;
  size?: string;
  searchKeyword?: string;
  feedType: string;
};

export const GetSearchPostsList = async (
  params: TGetSearchPostsListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.searchKeyword)
    queryParams.set('searchKeyword', params.searchKeyword);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.feedType) queryParams.set('feedType', params.feedType);

  const url = `/api/search/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetSearchPostsList = (params: TGetSearchPostsListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IPostListResponse>,
    Error,
    TInfiniteListResult<IPostListResponse>
  >({
    queryKey: queryKeys.search.postList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetSearchPostsList({
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
