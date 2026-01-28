import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BooleanNotificationSettingKey } from './useGetNotificationSetting';

import {
  notificationSettingKey,
  notificationSettingListKey,
} from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

type PatchNotificationSettingParams =
  | {
      slug: BooleanNotificationSettingKey;
      booleanValue: boolean;
      timeValue?: never;
    }
  | {
      slug: 'remindTime';
      timeValue: string;
      booleanValue?: never;
    };

export const patchNotificationSetting = async (
  params: PatchNotificationSettingParams,
) => {
  const response = await agent(`/api/v1/notifications/settings`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });

  return response;
};

export const usePatchNotificationSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchNotificationSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [notificationSettingKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [notificationSettingListKey],
      });
    },
  });
};
