import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { logoutKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postLogout = async () => {
  const response = await agent(`/api/v1/auth/logout`, {
    method: 'POST',
  });

  return response;
};

export const usePostLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLogout,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [logoutKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
