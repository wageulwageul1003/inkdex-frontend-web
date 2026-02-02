import { useInfiniteQuery } from '@tanstack/react-query';

import { commentListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICommentItemResponse {
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

export interface ICommentListResponse {
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
  replies: ICommentItemResponse[];
}

// PARAMS TYPE
type TGetCommentListParams = {
  id: string;
  page?: string;
  size?: string;
  sort?: string;
};

export interface ICommentListApiResponse {
  code: number;
  data: {
    totalCommentsCount: number;
    content: ICommentListResponse[];
    paging: IResponsePaged<ICommentListResponse>['data']['paging'];
  };
  message: string;
  error: null | string;
}

export interface ICommentListData {
  totalCommentsCount: number;
  paging: IResponsePaged<ICommentListResponse>['data']['paging'];
  content: ICommentListResponse[];
}

export const GetCommentList = async (
  params: TGetCommentListParams,
): Promise<ICommentListApiResponse> => {
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
  return useInfiniteQuery<ICommentListApiResponse, Error, ICommentListData>({
    queryKey: [commentListKey, params],
    queryFn: ({ pageParam = 1 }) =>
      GetCommentList({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.paging.hasNext
        ? lastPage.data.paging.currentPage + 1
        : undefined,

    select: (data) => ({
      totalCommentsCount: data.pages[0].data.totalCommentsCount,
      content: data.pages.flatMap((p) => p.data.content),
      paging: data.pages[0].data.paging,
    }),
  });
};
