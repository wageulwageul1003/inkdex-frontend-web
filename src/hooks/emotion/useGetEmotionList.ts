import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface ICategoryListResponse {
  uuid: string;
  name: string;
}

export const GetCategoryList = async (): Promise<
  IResponse<ICategoryListResponse>
> => {
  const data = await agent(`/api/emotion/all`, {
    method: 'GET',
  });

  return data;
};

export const useGetEmotionList = (): UseQueryResult<
  IResponse<ICategoryListResponse>
> =>
  useQuery({
    queryKey: queryKeys.emotion._def,
    queryFn: () => GetCategoryList(),
  });
