import { useQuery } from '@tanstack/react-query';

import { faqCategoryKey } from '@/constants/queryKeys';
import { IConstant } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFaqCategoryResponse {
  uuid: string;
  label: string;
}

export const GetFaqCategory = async (
  constFaqType: string,
): Promise<IConstant[]> => {
  const data = await agent(`/api/faq/category-list/${constFaqType}`, {
    method: 'GET',
  });

  // Transform the data to the required format
  return data.data.map((item: IFaqCategoryResponse) => ({
    label: item.label,
    value: item.uuid,
    disabled: false,
  }));
};

export const useGetFaqCategory = (constFaqType: string) =>
  useQuery({
    queryKey: [faqCategoryKey, constFaqType],
    queryFn: () => GetFaqCategory(constFaqType),
    enabled: !!constFaqType,
  });
