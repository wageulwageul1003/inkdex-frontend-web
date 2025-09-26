import { useQuery } from '@tanstack/react-query';

import { faqDetailKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IFaqDetailResponse {
  uuid: string;

  faqCategoryName: string;
  title: string;
  content: string;
  isShow: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export const GetFaqDetail = async (
  uuid: string,
  constFaqType: string,
): Promise<IFaqDetailResponse> => {
  const data = await agent(`/api/faq/${constFaqType}/${uuid}`, {
    method: 'GET',
  });

  return data.data;
};

export const useGetFaqDetail = (uuid: string, constFaqType: string) =>
  useQuery({
    queryKey: [faqDetailKey, uuid, constFaqType],
    queryFn: () => GetFaqDetail(uuid, constFaqType),
    enabled: !!uuid && !!constFaqType,
  });
