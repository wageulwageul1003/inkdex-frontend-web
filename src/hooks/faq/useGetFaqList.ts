import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

import { faqListKey } from '@/constants/queryKeys';
import { IResponsePaged } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFaqListResponse {
  uuid: string;
  question: string;
  answer: string;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
  };
}

//  PARAMS TYPE
type TFaqListParams = {
  page?: string;
  size?: string;
  faqCategoryUuid?: string;
};

export const FaqListScheme = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  faqCategoryUuid: z.string().optional(),
});

export const GetFaqList = async (
  params: TFaqListParams,
): Promise<IResponsePaged<IFaqListResponse>> => {
  const queryParams = new URLSearchParams();

  // Add basic parameters
  if (params.faqCategoryUuid && params.faqCategoryUuid !== 'all')
    queryParams.append('faqCategoryUuid', params.faqCategoryUuid);
  if (params.page) queryParams.append('page', String(Number(params.page) - 1));
  if (params.size) queryParams.append('size', params.size);

  // Construct the URL
  const url = `/api/faqs?${queryParams.toString()}`;

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
