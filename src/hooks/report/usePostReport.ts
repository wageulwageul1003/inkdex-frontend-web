import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { reportKey, reportListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export type TReportPayloadType = {
  targetUuid: string;
  type: string; // POST or COMMENT
};

export const postReport = async (payload: TReportPayloadType) => {
  const response = await agent(`/api/report`, {
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
