import { useQuery } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface INotificationListResponse {
  date: string;
  notifications: {
    uuid: string;
    type: string;
    title: string;
    content: string;
    isRead: boolean;
    sender: {
      uuid: string;
      nickname: string;
      profileImageUrl: string | null;
    };
    targetUuid: string;
    createdAt: string;
  }[];
}
export const getNotificationList = async (): Promise<
  IResponse<INotificationListResponse>
> => {
  const url = `/api/account/notifications`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetNotificationList = () =>
  useQuery({
    queryKey: queryKeys.notification.list.queryKey,
    queryFn: () => getNotificationList(),
    enabled: true,
  });
