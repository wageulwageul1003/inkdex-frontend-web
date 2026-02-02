import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import {
  deleteRecentSearchKeywordKey,
  recentSearchKeywordsKey,
} from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteSearchKeywordAll = async () => {
  const response = await agent(`/api/v1/search/recent/all`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteSearchKeywordAll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSearchKeywordAll,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteRecentSearchKeywordKey],
      });
      await queryClient.refetchQueries({
        queryKey: [recentSearchKeywordsKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
