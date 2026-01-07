import { useQuery } from '@tanstack/react-query';

import { notificationUnReadCountKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface INotificationUnReadCountResponse {
  uuid: string;

  faqCategoryName: string;
  title: string;
  content: string;
  isShow: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export const GetNotificationUnReadCount =
  async (): Promise<INotificationUnReadCountResponse> => {
    const data = await agent(`/api/v1/notification/unread-count`, {
      method: 'GET',
    });

    return data.data;
  };

export const useGetNotificationUnReadCount = () =>
  useQuery({
    queryKey: [notificationUnReadCountKey],
    queryFn: () => GetNotificationUnReadCount(),
  });
