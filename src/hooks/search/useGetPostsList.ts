import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IPostListResponse } from '@/types/post.types';

// PARAMS TYPE
type TGetPostsListParams = {
  page?: string;
  size?: string;
  searchKeyword?: string;
  feedType?: string;
  targetAccountUuid?: string;
};

export const getPostsList = async (
  params: TGetPostsListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.searchKeyword)
    queryParams.set('searchKeyword', params.searchKeyword);
  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.feedType) queryParams.set('feedType', params.feedType);
  if (params.targetAccountUuid)
    queryParams.set('targetAccountUuid', params.targetAccountUuid);

  const url = `/api/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetPostsList = (params: TGetPostsListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IPostListResponse>,
    Error,
    TInfiniteListResult<IPostListResponse>
  >({
    queryKey: queryKeys.post.list(params).queryKey,

    queryFn: ({ pageParam }) => {
      return getPostsList({
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
