import { useInfiniteQuery } from '@tanstack/react-query';

import { myInkdexFeedListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyInkdexFeedListResponse {
  id: string;
  yearMonth: string;
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
type TGetMyInkdexFeedListParams = {
  category?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  page?: string;
  size?: string;
  sort?: string;
};

export const GetMyInkdexFeedList = async (
  params: TGetMyInkdexFeedListParams,
): Promise<IResponsePaged<IMyInkdexFeedListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.set('category', params.category);
  if (params.startDate) queryParams.set('startDate', params.startDate);
  if (params.endDate) queryParams.set('endDate', params.endDate);
  if (params.date) queryParams.set('date', params.date);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/me/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyInkdexFeedList = (params: TGetMyInkdexFeedListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IMyInkdexFeedListResponse>,
    Error,
    TInfiniteListResult<IMyInkdexFeedListResponse>
  >({
    queryKey: [myInkdexFeedListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetMyInkdexFeedList({ ...params, page: String(pageParam) }),
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
