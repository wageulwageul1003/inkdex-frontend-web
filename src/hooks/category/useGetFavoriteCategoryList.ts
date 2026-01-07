import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { favoriteCategoryListKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFavoriteCategoryeResponse {
  slug: string;
  name: string;
}

export const GetFavoriteCategoryList = async (): Promise<
  IResponse<IFavoriteCategoryeResponse>
> => {
  const data = await agent(`/api/v1/me/preferred-categories`, {
    method: 'GET',
  });

  return data;
};

export const useGetFavoriteCategoryList = (): UseQueryResult<
  IResponse<IFavoriteCategoryeResponse>
> =>
  useQuery({
    queryKey: [favoriteCategoryListKey],
    queryFn: () => GetFavoriteCategoryList(),
  });
