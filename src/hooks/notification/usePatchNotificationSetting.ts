import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

type PatchNotificationSettingParams = {
  key: string;
  enabled: boolean;
  value?: string | null;
};

export const patchNotificationSetting = async (
  params: PatchNotificationSettingParams,
) => {
  const response = await agent(`/api/account/notification-settings`, {
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
        queryKey: queryKeys.notificationSetting._def,
      });
    },
  });
};
