import { useQuery } from '@tanstack/react-query';

import { faqCategoryKey } from '@/constants/queryKeys';
import { IConstant } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFaqCategoryResponse {
  uuid: string;
  name: string;
  createdAt: string;
}

export const GetFaqCategory = async (): Promise<IConstant[]> => {
  const data = await agent(`/api/faqs/categories`, {
    method: 'GET',
  });

  // Transform the data to the required format
  return data.data.map((item: IFaqCategoryResponse) => ({
    label: item.name,
    value: item.uuid,
    disabled: false,
  }));
};

export const useGetFaqCategory = () =>
  useQuery({
    queryKey: [faqCategoryKey],
    queryFn: () => GetFaqCategory(),
  });
