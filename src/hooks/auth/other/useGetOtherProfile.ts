import { useQuery } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IResponseDetail } from '@/types/global';

export interface IOtherProfileResponse {
  nickname: string;
  bio: null | string;
  profileImageUrl: null | string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
}

export const GetOtherProfile = async (
  uuid: string,
): Promise<IResponseDetail<IOtherProfileResponse>> => {
  const data = await agent(`/api/other/profile/${uuid}`, {
    method: 'GET',
  });

  return data;
};

export const useGetOtherProfile = (uuid: string) =>
  useQuery({
    queryKey: queryKeys.other.profile(uuid).queryKey,
    queryFn: () => GetOtherProfile(uuid),
    enabled: !!uuid,
  });
