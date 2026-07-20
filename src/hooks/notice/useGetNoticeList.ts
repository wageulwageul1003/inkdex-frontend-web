import { z } from 'zod';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { useInfiniteQuery } from '@tanstack/react-query';

export interface INoticeListResponse {
  uuid: string;
  title: string;
  content: string;
  viewCount: number;
  isPinned: boolean;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
  };
}

//  PARAMS TYPE
type TNoticeListParams = {
  page?: string;
  size?: string;
  searchKeyword?: string;
  noticeCategoryUuid?: string;
};

export const NoticeListScheme = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  noticeCategoryUuid: z.string().optional(),
});

export const getNoticeList = async (
  params: TNoticeListParams,
): Promise<IResponsePaged<INoticeListResponse>> => {
  const queryParams = new URLSearchParams();

  // Add basic parameters
  if (params.page) queryParams.append('page', String(params.page));
  if (params.size) queryParams.append('size', params.size);
  if (params.noticeCategoryUuid && params.noticeCategoryUuid !== 'all')
    queryParams.append('noticeCategoryUuid', params.noticeCategoryUuid);

  // Construct the URL
  const url = `/api/notices?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetNoticeList = (params: TNoticeListParams) => {
  return useInfiniteQuery<
    IResponsePaged<INoticeListResponse>,
    Error,
    TInfiniteListResult<INoticeListResponse>
  >({
    queryKey: queryKeys.notice.list(params).queryKey,

    queryFn: ({ pageParam }) => {
      return getNoticeList({
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
