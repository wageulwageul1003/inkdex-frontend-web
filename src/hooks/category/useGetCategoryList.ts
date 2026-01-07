import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { categoryListKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ICategoryListResponse {
  slug: string;
  name: string;
}

export const GetCategoryList = async (): Promise<
  IResponse<ICategoryListResponse>
> => {
  const url = `/api/v1/categories`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetCategoryList = (): UseQueryResult<
  IResponse<ICategoryListResponse>
> =>
  useQuery({
    queryKey: [categoryListKey],
    queryFn: () => GetCategoryList(),
  });
