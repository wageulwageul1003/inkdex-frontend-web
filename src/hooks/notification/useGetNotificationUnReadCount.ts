import { useQuery } from '@tanstack/react-query';

import { notificationUnReadCountKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface INotificationUnReadCountResponse {
  content: number;
}

export const GetNotificationUnReadCount =
  async (): Promise<INotificationUnReadCountResponse> => {
    const data = await agent(`/api/v1/notifications/unread-count`, {
      method: 'GET',
    });

    return data.data;
  };

export const useGetNotificationUnReadCount = () =>
  useQuery({
    queryKey: [notificationUnReadCountKey],
    queryFn: () => GetNotificationUnReadCount(),
  });
