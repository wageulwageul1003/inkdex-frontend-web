import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import {
  deleteRecentSearchKeywordKey,
  recentSearchKeywordsKey,
} from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const deleteSearchKeyword = async (params: { searchId: string }) => {
  const response = await agent(`/api/v1/search/recent/${params.searchId}`, {
    method: 'DELETE',
  });

  return response;
};

export const useDeleteSearchKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSearchKeyword,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [deleteRecentSearchKeywordKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [recentSearchKeywordsKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
