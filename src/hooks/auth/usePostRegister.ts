import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TRegisterSchema } from '@/components/views/(no-protected)/register/schema';
import { registerKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const postRegister = async (payload: TRegisterSchema) => {
  const response = await agent(`/api/account`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const usePostRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRegister,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [registerKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
