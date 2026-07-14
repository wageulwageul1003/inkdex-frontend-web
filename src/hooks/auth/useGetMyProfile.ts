import { useQuery } from '@tanstack/react-query';

import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IMyProfileResponse {
  nickname: string;
  email: string;
  bio: null | string;
  profileImageUrl: null | string;
  followerCount: number;
  followingCount: number;
  provider: string[];
  hasPassword: boolean;
}

export const GetMyProfile = async (): Promise<
  IResponseDetail<IMyProfileResponse>
> => {
  const data = await agent(`/api/account/profile`, {
    method: 'GET',
  });

  return data;
};

export const useGetMyProfile = (disabled?: boolean) =>
  useQuery({
    queryKey: queryKeys.mypage.profile.queryKey,
    queryFn: () => GetMyProfile(),
    enabled: disabled,
  });
