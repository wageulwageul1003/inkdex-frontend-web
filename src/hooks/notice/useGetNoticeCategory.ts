import { useQuery } from '@tanstack/react-query';

import { noticeCategoryKey } from '@/constants/queryKeys';
import { IConstant } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface INoticeCategoryResponse {
  uuid: string;
  name: string;
  createdAt: string;
}

export const GetNoticeCategory = async (): Promise<IConstant[]> => {
  const data = await agent(`/api/notices/categories`, {
    method: 'GET',
  });

  // Transform the data to the required format
  return data.data.map((item: INoticeCategoryResponse) => ({
    label: item.name,
    value: item.uuid,
    disabled: false,
  }));
};

export const useGetNoticeCategory = () =>
  useQuery({
    queryKey: [noticeCategoryKey],
    queryFn: () => GetNoticeCategory(),
  });
