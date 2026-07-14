import { useInfiniteQuery } from '@tanstack/react-query';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface INotificationListResponse {
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
};

export const GetNotificationList = async (
  params: TGetNotificationListParams,
): Promise<IResponsePaged<INotificationListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/v1/notifications?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetNotificationList = (params: TGetNotificationListParams) => {
  return useInfiniteQuery<
    IResponsePaged<INotificationListResponse>,
    Error,
    TInfiniteListResult<INotificationListResponse>
  >({
    queryKey: queryKeys.notification.list(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetNotificationList({
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
