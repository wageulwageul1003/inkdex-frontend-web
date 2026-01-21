import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationSettingKey } from '@/constants/queryKeys';
import { agent, ErrorData } from '@/utils/fetch';

interface PatchNotificationSettingParams {
  [key: string]: boolean;
}

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
    },
    onError: (error: ErrorData) => {
      console.error('알림 설정 업데이트 실패:', error);
    },
  });
};
