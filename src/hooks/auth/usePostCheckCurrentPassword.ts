import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { checkCurrentPasswordKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postCheckCurrentPassword = async (params: {
  currentPassword: string;
}) => {
  const response = await agent(`/api/v1/me/check-password`, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return response;
};

export const usePostCheckCurrentPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCheckCurrentPassword,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [checkCurrentPasswordKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
