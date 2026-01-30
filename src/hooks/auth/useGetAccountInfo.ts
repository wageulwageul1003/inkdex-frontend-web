import { useQuery } from '@tanstack/react-query';

import { accountInfoKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IAccountInfoResponse {
  provider: string;
  hasPassword: boolean;
}

export const GetAccountInfo = async (): Promise<IAccountInfoResponse> => {
  const data = await agent(`/api/v1/account/auth-info`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetAccountInfo = () =>
  useQuery({
    queryKey: [accountInfoKey],
    queryFn: () => GetAccountInfo(),
  });
