import { useInfiniteQuery } from '@tanstack/react-query';

import { postsListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyPostsResponse {
  aspectRatio: number;
  publicId: string;
  userPublicId: string;
  userNickname: string;
  profileImageUrl: string | null;
  thumbnailUrl: string;
  viewCount: number;
  imageMetadata: {
    width: number;
    height: number;
    aspectRatio: number;
    fileSize: number;
  };
}

// PARAMS TYPE
type TGetMyPostsParams = {
  category?: string;
  page?: string;
  size?: string;
  sort?: string;
};

export const GetMyPosts = async (
  params: TGetMyPostsParams,
): Promise<IResponsePaged<IMyPostsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.set('category', params.category);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/mypage?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyPosts = (params: TGetMyPostsParams) => {
  return useInfiniteQuery<IResponsePaged<IMyPostsResponse>>({
    queryKey: [postsListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetMyPosts({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined;
    },
  });
};
