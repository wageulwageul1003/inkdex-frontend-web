import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { TRegisterSchema } from '@/components/views/(no-protected)/register/schema';
import { registerKey } from '@/constants/queryKeys';
import { CERTIFICATION_TOKEN } from '@/constants/tokens';
import { ErrorData, agent } from '@/utils/fetch';

interface RegisterParams extends TRegisterSchema {
  imageFile?: File;
}

const createFormData = (params: RegisterParams): FormData => {
  const formData = new FormData();

  const { imageFile, ...data } = params;

  formData.append('data', JSON.stringify(data));
  if (imageFile) {
    formData.append('image', imageFile, imageFile.name);
  }

  return formData;
};

export const postRegister = async (params: RegisterParams) => {
  const certificationToken = Cookies.get(CERTIFICATION_TOKEN);
  const formData = createFormData(params);

  const options: RequestInit = {
    method: 'POST',
    body: formData,
  };

  if (certificationToken) {
    if (!options.headers) {
      options.headers = {};
    }
    (options.headers as Record<string, string>)['Authorization'] =
      `Bearer ${certificationToken}`;
  }

  const response = await agent(`/api/v1/auth/signup`, options);
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
