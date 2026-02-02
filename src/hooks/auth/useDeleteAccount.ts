import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { deleteAccountKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteAccount = async () => {
  const response = await agent(`/api/v1/me/account`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteAccountKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
