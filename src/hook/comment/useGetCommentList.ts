import { useInfiniteQuery } from '@tanstack/react-query';

import { commentListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICommentRepliesResponse {
  id: number;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  isLiked: boolean;
  likesCount: number;
  repliesCount: number;
}

export interface ICommentListResponse {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  likesCount: number;
  repliesCount: number;
  replies: ICommentRepliesResponse[];
}

// PARAMS TYPE
type TGetCommentListParams = {
  id: string;
  page?: string;
  size?: string;
  sort?: string;
};

export const GetCommentList = async (
  params: TGetCommentListParams,
): Promise<IResponsePaged<ICommentListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/posts/${params.id}/comments?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetCommentList = (params: TGetCommentListParams) => {
  return useInfiniteQuery<
    IResponsePaged<ICommentListResponse>,
    Error,
    TInfiniteListResult<ICommentListResponse>
  >({
    queryKey: [commentListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetCommentList({ ...params, page: String(pageParam) }),
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
