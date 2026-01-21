import { useQuery } from '@tanstack/react-query';

import { notificationSettingKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface INotificationSettingResponse {
  commentEnabled: boolean;
  replyEnabled: boolean;
  postLikeEnabled: boolean;
  commentLikeEnabled: boolean;
  followEnabled: boolean;
  bookmarkEnabled: boolean;
  marketingEnabled: boolean;
}

export const GetNotificationSetting =
  async (): Promise<INotificationSettingResponse> => {
    const data = await agent(`/api/v1/notifications/settings`, {
      method: 'GET',
    });

    return data.data.content;
  };

export const useGetNotificationSetting = () =>
  useQuery({
    queryKey: [notificationSettingKey],
    queryFn: () => GetNotificationSetting(),
    enabled: true,
  });
