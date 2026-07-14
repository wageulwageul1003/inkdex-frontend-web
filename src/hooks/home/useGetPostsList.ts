import { useInfiniteQuery } from '@tanstack/react-query';

import { postsListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IPostListResponse {
  uuid: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
  };
  collections: [
    {
      uuid: string;
      name: string;
    },
  ];
  tags: string[];
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  account: {
    uuid: string;
    nickname: string;
    profileImageUrl: null | string;
    bio: null | string;
    isFollowing: boolean;
  };
  isLiked: boolean;
  isBookmarked: boolean;
}

// PARAMS TYPE
type TGetPostsListParams = {
  page?: string;
  size?: string;
  sort?: string;
  feedType?: string;
};

export const GetPostist = async (
  params: TGetPostsListParams,
): Promise<IResponsePaged<IPostListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.size) queryParams.set('size', String(params.size));

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
      return GetPostist({
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
