import { useQuery } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { IResponse } from '@/types/global';
import { queryKeys } from '@/constants/query-key';

export interface INotificationSettingResponse {
  key: string;
  enabled: boolean;
  value: string | null;
}

export const GetNotificationSetting = async (): Promise<
  IResponse<INotificationSettingResponse>
> => {
  const data = await agent(`/api/account/notification-settings`, {
    method: 'GET',
  });

  return data;
};

export const useGetNotificationSetting = () =>
  useQuery({
    queryKey: queryKeys.notificationSetting._def,
    queryFn: () => GetNotificationSetting(),
    enabled: true,
  });
