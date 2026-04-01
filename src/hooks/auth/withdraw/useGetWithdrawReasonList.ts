import { useQuery } from '@tanstack/react-query';

import { withdrawReasonListKey } from '@/constants/queryKeys';
import { IConstant } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IWithdrawReasonListResponse {
  uuid: string;
  name: string;
}

export const GetWithdrawReasonList = async (): Promise<IConstant[]> => {
  const data = await agent(`/api/account/withdraw/reason`, {
    method: 'GET',
  });

  // Transform the data to the required format
  return data.data.map((item: IWithdrawReasonListResponse) => ({
    label: item.name,
    value: item.uuid,
    disabled: false,
  }));
};

export const useGetWithdrawReasonList = () =>
  useQuery({
    queryKey: [withdrawReasonListKey],
    queryFn: () => GetWithdrawReasonList(),
  });
