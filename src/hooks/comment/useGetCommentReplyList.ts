import { useInfiniteQuery } from '@tanstack/react-query';

import { commentReplyListKey } from '@/constants/queryKeys';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICommentReplyListResponse {
  id: string;
  nickname: string;
  profileImageUrl: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  likesCount: number;
  repliesCount: number;
}

// PARAMS TYPE
type TGetCommentListParams = {
  commentId: string;
  page?: string;
  size?: string;
  sort?: string;
  enable?: boolean;
};

export const GetCommentReplyList = async (
  params: TGetCommentListParams,
): Promise<IResponsePaged<ICommentReplyListResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.sort) queryParams.set('sort', String(params.sort));

  const url = `/api/v1/comments/${params.commentId}/replies?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetCommentReplyList = (params: TGetCommentListParams) => {
  return useInfiniteQuery<
    IResponsePaged<ICommentReplyListResponse>,
    Error,
    TInfiniteListResult<ICommentReplyListResponse>
  >({
    queryKey: [commentReplyListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetCommentReplyList({ ...params, page: String(pageParam) }),
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
