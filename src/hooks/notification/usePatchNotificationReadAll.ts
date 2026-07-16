import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { ErrorData, agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export const patchNotificationRead = async () => {
  const response = await agent(`/api/account/notifications/read/all`, {
    method: 'PATCH',
  });

  return response;
};

export const usePatchNotificationReadAll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchNotificationRead,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.notification.list._def,
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('업데이트 실패:', error);
    },
  });
};
