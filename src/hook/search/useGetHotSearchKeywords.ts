import { useQuery } from '@tanstack/react-query';

import { IRecentSearchKeywordsResponse } from './useGetRecentSearchKeywords';

import { recentSearchKeywordsKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IHotSearchKeywordsResponse {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

export const GetHotSearchKeywords =
  async (): Promise<IRecentSearchKeywordsResponse> => {
    const data = await agent(`/api/v1/search/popular-searches`, {
      method: 'GET',
    });

    return data.data.content;
  };

export const useGetHotSearchKeywords = () =>
  useQuery({
    queryKey: [recentSearchKeywordsKey],
    queryFn: () => GetHotSearchKeywords(),
  });
