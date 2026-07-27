import { useQuery } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { IResponse } from '@/types/global';
import { queryKeys } from '@/constants/query-key';

export interface IReportReasonResponse {
  uuid: string;
  name: string;
  createdAt: string;
}

export const getReportReasonList = async (): Promise<
  IResponse<IReportReasonResponse>
> => {
  const data = await agent(`/api/posts/report/reason/all`, {
    method: 'GET',
  });

  return data;
};

export const useGetReportReasonList = () =>
  useQuery({
    queryKey: queryKeys.post.reportReason.queryKey,
    queryFn: () => getReportReasonList(),
  });
