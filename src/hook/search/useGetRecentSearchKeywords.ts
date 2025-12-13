import { useQuery } from '@tanstack/react-query';

import { recentSearchKeywordsKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IRecentSearchKeywordsResponse {
  id: string;
  searchTerm: string;
}

export const GetRecentSearchKeywords = async (): Promise<
  IRecentSearchKeywordsResponse[]
> => {
  const data = await agent(`/api/v1/search/me/recent`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetRecentSearchKeywords = () =>
  useQuery({
    queryKey: [recentSearchKeywordsKey],
    queryFn: () => GetRecentSearchKeywords(),
  });
