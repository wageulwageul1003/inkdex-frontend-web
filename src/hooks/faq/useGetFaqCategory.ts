import { useQuery } from '@tanstack/react-query';

import { faqCategoryKey } from '@/constants/queryKeys';
import { IConstant } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFaqCategoryResponse {
  codeGroup: string;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
}

export const GetFaqCategory = async (): Promise<IConstant[]> => {
  const data = await agent(`/api/v1/faqs/categories`, {
    method: 'GET',
  });

  // Transform the data to the required format
  return data.data.content.map((item: IFaqCategoryResponse) => ({
    label: item.name,
    value: item.code,
    disabled: false,
  }));
};

export const useGetFaqCategory = () =>
  useQuery({
    queryKey: [faqCategoryKey],
    queryFn: () => GetFaqCategory(),
  });
