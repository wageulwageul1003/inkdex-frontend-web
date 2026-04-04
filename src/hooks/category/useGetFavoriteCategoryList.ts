import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { favoriteCategoryListKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IFavoriteCategoryeResponse {
  uuid: string;
  name: string;
}

export const GetFavoriteCategoryList = async (): Promise<
  IResponse<IFavoriteCategoryeResponse>
> => {
  const data = await agent(`/api/account/categories`, {
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
