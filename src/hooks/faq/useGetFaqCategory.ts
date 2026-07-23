import { useQuery } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IFaqCategoryResponse {
  uuid: string;
  name: string;
  createdAt: string;
}

export const GetFaqCategory = async (): Promise<
  IResponse<IFaqCategoryResponse>
> => {
  const data = await agent(`/api/faqs/categories/all`, {
    method: 'GET',
  });

  return data;
};

export const useGetFaqCategory = () =>
  useQuery({
    queryKey: queryKeys.faq.categoryList.queryKey,
    queryFn: () => GetFaqCategory(),
  });
