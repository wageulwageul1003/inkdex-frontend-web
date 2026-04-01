import { useMutation } from '@tanstack/react-query';

import { TFeedbackSchema } from '@/components/views/(protected)/preferences/feedback/scheme';
import { agent } from '@/utils/fetch';

export const postFeedback = async (payload: TFeedbackSchema) => {
  const response = await agent(`/api/feedback`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
};

export const usePostFeedback = () => {
  return useMutation({
    mutationFn: postFeedback,
  });
};
