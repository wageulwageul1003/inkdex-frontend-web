import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { setPasswordKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postSetPassword = async (params: { password: string }) => {
  const response = await agent(`/api/v1/me/set-password`, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return response;
};

export const usePostSetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSetPassword,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [setPasswordKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
