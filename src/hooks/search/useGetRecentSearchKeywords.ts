import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { recentSearchKeywordsKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IRecentSearchKeywordsResponse {
  id: string;
  searchTerm: string;
}

export const GetRecentSearchKeywords = async (): Promise<
  IResponse<IRecentSearchKeywordsResponse>
> => {
  const data = await agent(`/api/v1/search/me/recent`, {
    method: 'GET',
  });

  return data;
};

export const useGetRecentSearchKeywords = (): UseQueryResult<
  IResponse<IRecentSearchKeywordsResponse>
> =>
  useQuery({
    queryKey: [recentSearchKeywordsKey],
    queryFn: () => GetRecentSearchKeywords(),
  });
