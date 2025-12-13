import { useInfiniteQuery } from '@tanstack/react-query';

import { postsListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IPostListResponse {
  publicId: string;
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
type TGetPostsListParams = {
  category?: string;
  page?: string;
  size?: string;
  sort?: string;
};

export const GetPostsList = async (
  params: TGetPostsListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.set('category', params.category);
  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/posts/list?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetPostsList = (params: TGetPostsListParams) => {
  return useInfiniteQuery<IResponsePaged<IPostListResponse>>({
    queryKey: [postsListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetPostsList({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined;
    },
  });
};
