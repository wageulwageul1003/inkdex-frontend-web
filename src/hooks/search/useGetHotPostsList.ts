import { useInfiniteQuery } from '@tanstack/react-query';

import { hotPostsListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IHotPostListResponse {
  id: string;
  userId: string;
  userNickname: string;
  profileImageUrl: string;
  userBio: string;
  following: boolean;
  categorySlug: string;
  content: string;
  imageUrl: string;
  thumbnailUrl: string;
  imageMetadata: {
    width: number;
    height: number;
    aspectRatio: number;
    fileSize: number;
  };
  tags: string[];
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// PARAMS TYPE
type TGetHotPostsListParams = {
  query?: string;
  page?: string;
  size?: string;
};

export const GetHotPostsList = async (
  params: TGetHotPostsListParams,
): Promise<IResponsePaged<IHotPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.query) queryParams.set('query', params.query);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/search/popular-posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetHotPostsList = (params: TGetHotPostsListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IHotPostListResponse>,
    Error,
    TInfiniteListResult<IHotPostListResponse>
  >({
    queryKey: [hotPostsListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetHotPostsList({ ...params, page: String(pageParam) }),
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
