import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TFavoriteCategoriesSchema } from '@/components/views/(protected)/favorite-categories/schema';
import { favoriteCategoryListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const PutFavoriteCategory = async (
  params: TFavoriteCategoriesSchema,
) => {
  const response = await agent(`/api/v1/me/preferred-categories`, {
    method: 'PUT',
    body: JSON.stringify(params.preferredCategorySlugs),
  });
  return response;
};

export const usePutFavoriteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PutFavoriteCategory,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [favoriteCategoryListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
