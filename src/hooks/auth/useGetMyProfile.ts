import { useQuery } from '@tanstack/react-query';

import { myProfileKey } from '@/constants/queryKeys';
import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyProfileResponse {
  nickname: string;
  bio: null | string;
  profileImageUrl: null | string;
  followerCount: number;
  followingCount: number;
}

export const GetMyProfile = async (): Promise<
  IResponseDetail<IMyProfileResponse>
> => {
  const data = await agent(`/api/account/profile`, {
    method: 'GET',
  });

  return data;
};

export const useGetMyProfile = () =>
  useQuery({
    queryKey: [myProfileKey],
    queryFn: () => GetMyProfile(),
  });
