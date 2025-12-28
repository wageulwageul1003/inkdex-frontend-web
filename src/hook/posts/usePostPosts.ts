import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TWriteSchema } from '@/components/views/(protected)/posts/schema';
import { postsKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

interface PostParams extends TWriteSchema {
  imageFile: File;
}

const createFormData = (params: PostParams): FormData => {
  const formData = new FormData();

  const data = {
    categorySlug: params.categorySlug,
    content: params.content,
    tags: params.tags || [],
    collectionIds: params.collectionIds || [],
  };

  formData.append('data', JSON.stringify(data));
  formData.append('image', params.imageFile, params.imageFile.name);

  return formData;
};

export const postRegister = async (params: PostParams) => {
  const formData = createFormData(params);

  const response = await agent(`/api/v1/posts`, {
    method: 'POST',
    body: formData,
  });

  return response;
};

export const usePostPosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRegister,

    onSuccess: async (response) => {
      // 쿼리 캐시 갱신
      await queryClient.invalidateQueries({
        queryKey: [postsKey],
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('게시물 등록 실패:', error);
    },
  });
};
