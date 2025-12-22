import { useInfiniteQuery } from '@tanstack/react-query';

import { latestPostsListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ILatestPostListResponse {
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

export const GetLatestPostsList = async (
  params: TGetHotPostsListParams,
): Promise<IResponsePaged<ILatestPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.query) queryParams.set('query', params.query);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/search/latest-posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetLatestPostsList = (params: TGetHotPostsListParams) => {
  return useInfiniteQuery<
    IResponsePaged<ILatestPostListResponse>,
    Error,
    TInfiniteListResult<ILatestPostListResponse>
  >({
    queryKey: [latestPostsListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetLatestPostsList({ ...params, page: String(pageParam) }),
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
