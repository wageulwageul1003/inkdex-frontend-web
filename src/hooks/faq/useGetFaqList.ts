import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

import { faqListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFaqListResponse {
  uuid: string;
  faqCategoryName: string;
  title: string;
  content: string;
  isShow: string;
  priority: number;
  constFaqType: string;
  createdAt: string;
  updatedAt: string;
}

//  PARAMS TYPE
type TFaqListParams = {
  page?: string;
  size?: string;
  searchKeyword?: string;
  categoryCode?: string;
};

export const FaqListScheme = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  searchKeyword: z.string().optional(),
  categoryCode: z.string().optional(),
});

export const GetFaqList = async (
  params: TFaqListParams,
): Promise<IResponsePaged<IFaqListResponse>> => {
  const queryParams = new URLSearchParams();

  // Add basic parameters
  if (params.searchKeyword)
    queryParams.append('searchKeyword', params.searchKeyword);
  if (params.page) queryParams.append('page', String(Number(params.page) - 1));
  if (params.size) queryParams.append('size', params.size);

  // Construct the URL
  const url = `/api/v1/faqs/${params.categoryCode}?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetFaqList = (
  params: TFaqListParams,
): UseQueryResult<IResponsePaged<IFaqListResponse>> =>
  useQuery({
    queryKey: [faqListKey, params],
    queryFn: () => GetFaqList(params),
  });
