import { useInfiniteQuery } from '@tanstack/react-query';

import { notificationListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IPostListResponse {
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
type TGetNotificationListParams = {
  page?: string;
  size?: string;
  sort?: string;
};

export const GetNotificationList = async (
  params: TGetNotificationListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/notifications?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetNotificationList = (params: TGetNotificationListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IPostListResponse>,
    Error,
    TInfiniteListResult<IPostListResponse>
  >({
    queryKey: [notificationListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetNotificationList({ ...params, page: String(pageParam) }),
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
