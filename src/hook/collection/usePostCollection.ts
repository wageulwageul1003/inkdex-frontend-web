import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCollectionWriteSchema } from '@/components/views/(protected)/collection/schema';
import { collectionKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

interface PostCollectionParams extends TCollectionWriteSchema {
  imageFile: File;
}

const createFormData = (params: PostCollectionParams): FormData => {
  const formData = new FormData();

  const data = {
    name: params.name,
  };

  formData.append('data', JSON.stringify(data));
  formData.append('image', params.imageFile, params.imageFile.name);

  return formData;
};

export const postCollection = async (params: PostCollectionParams) => {
  const formData = createFormData(params);

  const response = await agent(`/api/v1/collections`, {
    method: 'POST',
    body: formData,
  });

  return response;
};

export const usePostCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCollection,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [collectionKey],
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('게시물 등록 실패:', error);
    },
  });
};
