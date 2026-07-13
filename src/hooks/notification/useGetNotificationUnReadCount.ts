import { useQuery } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { IResponseDetail } from '@/types/global';
import { queryKeys } from '@/constants/query-key';

export interface INotificationReadStatusResponse {
  isAllRead: boolean;
}

export const GetNotificationReadStatus = async (): Promise<
  IResponseDetail<INotificationReadStatusResponse>
> => {
  const data = await agent(`/api/account/notifications/read-status`, {
    method: 'GET',
  });

  return data;
};

export const useGetNotificationReadStatus = () =>
  useQuery({
    queryKey: queryKeys.notification.readStatus.queryKey,
    queryFn: () => GetNotificationReadStatus(),
  });
