import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export const DeletePost = async (postUuid: string) => {
  const response = await agent(`/api/posts/${postUuid}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: DeletePost,

    onSuccess: async () => {},
  });
};
