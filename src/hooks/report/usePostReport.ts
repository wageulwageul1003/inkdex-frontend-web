import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

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
  return useMutation({
    mutationFn: postReport,

    onSuccess: async () => {},
  });
};
