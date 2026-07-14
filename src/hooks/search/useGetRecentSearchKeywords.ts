import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
    queryKey: queryKeys.search.recentSearchKeywordList.queryKey,
    queryFn: () => GetRecentSearchKeywords(),
  });
