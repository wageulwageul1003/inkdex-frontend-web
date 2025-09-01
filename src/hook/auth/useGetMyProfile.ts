import { useQuery } from '@tanstack/react-query';

import { myProfileKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyProfileResponse {
  id: string;
  nickname: string;
}

export const GetMyProfile = async (): Promise<
  IResponse<IMyProfileResponse>
> => {
  const data = await agent(`/api/v1/users/profile`, {
    method: 'GET',
  });

  return data;
};

export const useGetMyProfile = () =>
  useQuery({
    queryKey: [myProfileKey],
    queryFn: () => GetMyProfile(),
  });
