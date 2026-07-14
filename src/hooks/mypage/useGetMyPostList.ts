import { useInfiniteQuery } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IResponsePaged, TInfiniteListResult } from '@/types/global';

export interface IMyPostResponse {
  uuid: string;
  source: string;
  reflection: string;
  imageUrl: string;
  createdAt: string;
  collectionUuid: string[];
  tags: string[];
  likeCount: number;
  account: {
    uuid: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  isLiked: boolean;
}

type TGetMyPostParams = {
  year: string;
  month: string | null;
  page?: string;
  size?: string;
};

export const GetPostsList = async (
  params: TGetMyPostParams,
): Promise<IResponsePaged<IMyPostResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(Number(params.page) - 1));
  if (params.size) queryParams.set('size', String(params.size));
  if (params.year) queryParams.set('year', params.year);
  if (params.month) queryParams.set('month', params.month);

  const url = `/api/mypage/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useMyGetCollectionList = (params: TGetMyPostParams) => {
  return useInfiniteQuery<
    IResponsePaged<IMyPostResponse>,
    Error,
    TInfiniteListResult<IMyPostResponse>
  >({
    queryKey: queryKeys.mypage.postList(params).queryKey,

    queryFn: ({ pageParam }) => {
      return GetPostsList({
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
