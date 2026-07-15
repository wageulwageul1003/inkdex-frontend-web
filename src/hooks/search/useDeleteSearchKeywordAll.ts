import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export const deleteSearchKeywordAll = async () => {
  const response = await agent(`/api/search/recents/all`, {
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
        queryKey: queryKeys.search.recentSearchKeywordList.queryKey,
      });
    },
  });
};
