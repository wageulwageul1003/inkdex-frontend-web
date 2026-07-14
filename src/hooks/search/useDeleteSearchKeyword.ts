import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export const deleteSearchKeyword = async (payload: { keywordUuid: string }) => {
  const response = await agent(`/api/search/recents`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });

  return response;
};

export const useDeleteSearchKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSearchKeyword,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.search.recentSearchKeywordList.queryKey,
      });
    },
  });
};
