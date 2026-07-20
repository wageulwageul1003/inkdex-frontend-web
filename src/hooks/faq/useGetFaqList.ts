import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { IResponsePaged, TInfiniteListResult } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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

export const getFaqList = async (
  params: TFaqListParams,
): Promise<IResponsePaged<IFaqListResponse>> => {
  const queryParams = new URLSearchParams();

  // Add basic parameters
  if (params.faqCategoryUuid && params.faqCategoryUuid !== 'all')
    queryParams.append('faqCategoryUuid', params.faqCategoryUuid);
  if (params.page) queryParams.append('page', String(params.page));
  if (params.size) queryParams.append('size', params.size);
  if (params.faqCategoryUuid && params.faqCategoryUuid !== 'all')
    queryParams.append('faqCategoryUuid', params.faqCategoryUuid);

  // Construct the URL
  const url = `/api/faqs?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetFaqList = (params: TFaqListParams) => {
  return useInfiniteQuery<
    IResponsePaged<IFaqListResponse>,
    Error,
    TInfiniteListResult<IFaqListResponse>
  >({
    queryKey: queryKeys.faq.list(params).queryKey,

    queryFn: ({ pageParam }) => {
      return getFaqList({
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
