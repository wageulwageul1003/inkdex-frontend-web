import { useQuery } from '@tanstack/react-query';

import { recentSearchKeywordsKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IRecentSearchKeywordsResponse {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

export const GetRecentSearchKeywords =
  async (): Promise<IRecentSearchKeywordsResponse> => {
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
