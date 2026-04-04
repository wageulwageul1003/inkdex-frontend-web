import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { recentSearchKeywordsKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IRecentSearchKeywordsResponse {
  uuid: string;
  keyword: string;
  createdAt: string;
}

export const GetRecentSearchKeywords = async (): Promise<
  IResponse<IRecentSearchKeywordsResponse>
> => {
  const data = await agent(`/api/search/recents`, {
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
