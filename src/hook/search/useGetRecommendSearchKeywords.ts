import { useQuery } from '@tanstack/react-query';

import { recommendSearchKeywordsKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IRecommendSearchKeywordsResponse {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

export const GetRecommendSearchKeywords =
  async (): Promise<IRecommendSearchKeywordsResponse> => {
    const data = await agent(`/api/v1/search/suggested-searches`, {
      method: 'GET',
    });

    return data.data.content;
  };

export const useGetRecommendSearchKeywords = () =>
  useQuery({
    queryKey: [recommendSearchKeywordsKey],
    queryFn: () => GetRecommendSearchKeywords(),
  });
