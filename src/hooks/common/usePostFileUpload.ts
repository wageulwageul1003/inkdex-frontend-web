import { useMutation } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';

export const postFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await agent('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return response;
};

// TODO: 연동하기
export const usePostFileUpload = () => {
  return useMutation({
    mutationFn: postFileUpload,
  });
};
