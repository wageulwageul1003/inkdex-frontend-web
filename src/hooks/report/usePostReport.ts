import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export type TReportPayloadType = {
  postUuid: string;
  reportReasonUuid: string;
};

export const postReport = async (payload: TReportPayloadType) => {
  const response = await agent(`/api/posts/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostReport = () => {
  return useMutation({
    mutationFn: postReport,
  });
};
