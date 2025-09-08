import { useQuery } from '@tanstack/react-query';

import { myProfileKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IOtherProfileResponse {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
}

export const GetOtherProfile = async (
  uuid: string,
): Promise<IOtherProfileResponse> => {
  const data = await agent(`/api/v1/users/${uuid}/profile`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetOtherProfile = (uuid: string) =>
  useQuery({
    queryKey: [myProfileKey, uuid],
    queryFn: () => GetOtherProfile(uuid),
  });
