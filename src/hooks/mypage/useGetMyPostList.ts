import {
  useInfiniteQuery,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';

export interface IMyPostResponse {
  counts: number; // 전체 데이터 개수
  thumbnails: {
    date: string;
    thumbnailUrl: string;
    count: number;
  }[];
}

type TGetMyPostParams = {
  year: string;
  month: number | null;
  page?: string;
  size?: string;
};

export const GetPostsList = async (
  params: TGetMyPostParams,
): Promise<IResponsePaged<IMyPostResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));

  const url = `/api/mypage/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyPostList = (params: TGetMyPostParams) => {
  return useInfiniteQuery<
    IResponsePaged<IMyPostResponse>,
    Error,
    TInfiniteListResult<IMyPostResponse>
  >({
    queryKey: queryKeys.mypage.postList(params),
    queryFn: ({ pageParam = 1 }) =>
      GetPostsList({ ...params, page: String(pageParam) }),
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
