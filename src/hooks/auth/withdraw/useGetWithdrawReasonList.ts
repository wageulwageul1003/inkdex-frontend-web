import { useQuery } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface IWithdrawReasonListResponse {
  uuid: string;
  name: string;
}

export const GetWithdrawReasonList = async (): Promise<
  IResponse<IWithdrawReasonListResponse>
> => {
  const data = await agent(`/api/account/withdraw/reason`, {
    method: 'GET',
  });

  return data;
};

export const useGetWithdrawReasonList = () =>
  useQuery({
    queryKey: queryKeys.withdraw.reasonList.queryKey,
    queryFn: () => GetWithdrawReasonList(),
  });
