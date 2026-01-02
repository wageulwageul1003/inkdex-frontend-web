import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TEditProfileSchema } from '@/components/views/(protected)/mypage/edit-profile/schema';
import { myProfileKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

interface EditProfileParams extends TEditProfileSchema {
  imageFile: File;
}

const createFormData = (params: EditProfileParams): FormData => {
  const formData = new FormData();

  const data = {
    ...params,
  };

  formData.append('data', JSON.stringify(data));
  formData.append('image', params.imageFile, params.imageFile.name);

  return formData;
};

export const patchProfile = async (params: EditProfileParams) => {
  const formData = createFormData(params);

  const response = await agent(`/api/v1/profile`, {
    method: 'PATCH',
    body: formData,
  });

  return response;
};

export const usePatchProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchProfile,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [myProfileKey],
      });

      return response;
    },
    onError: (error: ErrorData) => {
      console.error('업데이트 실패:', error);
    },
  });
};
