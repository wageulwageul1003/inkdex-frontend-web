import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { reportKey, reportListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export type TReportPayloadType = {
  targetId: string;
  targetType: string;
  reason: string;
};

export const postReport = async (payload: TReportPayloadType) => {
  const response = await agent(`/api/v1/reports`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postReport,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [reportKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [reportListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
