import { useInfiniteQuery } from '@tanstack/react-query';

import { commentListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICommentItemResponse {
  uuid: string;
  content: string;
  createdAt: string;
  user: {
    uuid: string;
    nickname: string;
    profileImageUrl: null | string;
  };
}

export interface ICommentListResponse {
  uuid: string;
  content: string;
  createdAt: string;
  user: {
    uuid: string;
    nickname: string;
    profileImageUrl: null | string;
  };
  repliesCount: number;
  hasMoreReplies: boolean;
  replies: ICommentItemResponse[] | [];
}

// PARAMS TYPE
type TGetCommentListParams = {
  postUuid: string;
  page?: string;
  size?: string;
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

  const url = `/api/posts/${params.postUuid}/comment?${queryParams.toString()}`;

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
