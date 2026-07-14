import { useQuery } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface INoticeCategoryResponse {
  uuid: string;
  name: string;
  createdAt: string;
}

export const GetNoticeCategory = async (): Promise<
  IResponse<INoticeCategoryResponse>
> => {
  const data = await agent(`/api/notices/categories`, {
    method: 'GET',
  });

  return data;
};

export const useGetNoticeCategory = () =>
  useQuery({
    queryKey: queryKeys.notice.categoryList.queryKey,
    queryFn: () => GetNoticeCategory(),
  });
