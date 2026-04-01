import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

import { noticeListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

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

export const GetNoticeList = async (
  params: TNoticeListParams,
): Promise<IResponsePaged<INoticeListResponse>> => {
  const queryParams = new URLSearchParams();

  // Add basic parameters
  if (params.page) queryParams.append('page', String(Number(params.page) - 1));
  if (params.size) queryParams.append('size', params.size);

  // Construct the URL
  const url = `/api/notices?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetNoticeList = (
  params: TNoticeListParams,
): UseQueryResult<IResponsePaged<INoticeListResponse>> =>
  useQuery({
    queryKey: [noticeListKey, params],
    queryFn: () => GetNoticeList(params),
  });
