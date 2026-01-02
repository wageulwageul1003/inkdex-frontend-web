import { useQuery } from '@tanstack/react-query';

import { myProfileKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IMyProfileResponse {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
  bio: string;
}

export const GetMyProfile = async (): Promise<IMyProfileResponse> => {
  const data = await agent(`/api/v1/users/profile`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetMyProfile = () =>
  useQuery({
    queryKey: [myProfileKey],
    queryFn: () => GetMyProfile(),
  });
