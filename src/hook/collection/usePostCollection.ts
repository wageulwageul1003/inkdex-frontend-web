import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TCollectionWriteSchema } from '@/components/views/(protected)/collection/schema';
import { collectionKey } from '@/constants/queryKeys';
import { SELECTED_IMAGE } from '@/constants/tokens';
import { dataURLtoBlob } from '@/lib/utils';
import { ErrorData, agent } from '@/utils/fetch';

const createFormData = (params: TCollectionWriteSchema): FormData => {
  const formData = new FormData();

  // sessionStorage에서 이미지 데이터 가져오기
  const imageData = sessionStorage.getItem(SELECTED_IMAGE);

  if (imageData) {
    // Base64 이미지 데이터를 Blob으로 변환
    const imageBlob = dataURLtoBlob(imageData);
    formData.append('image', imageBlob, 'image.jpg');
  }

  const data = {
    name: params.name,
  };

  // 데이터 객체를 JSON 문자열로 변환하여 추가
  formData.append('data', JSON.stringify(data));

  return formData;
};

export const postCollection = async (params: TCollectionWriteSchema) => {
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
      // 성공 후 sessionStorage에서 이미지 데이터 삭제
      try {
        sessionStorage.removeItem(SELECTED_IMAGE);
      } catch (error) {
        console.error('이미지 데이터 삭제 실패:', error);
      }

      // 쿼리 캐시 갱신
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
