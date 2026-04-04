import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { TFavoriteCategoriesSchema } from '@/components/views/(protected)/favorite-categories/schema';
import { favoriteCategoryListKey } from '@/constants/queryKeys';
import { ErrorData, agent } from '@/utils/fetch';

export const PatchFavoriteCategory = async (
  payload: TFavoriteCategoriesSchema,
) => {
  const response = await agent(`/api/account/categories`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response;
};

export const usePatchFavoriteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PatchFavoriteCategory,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [favoriteCategoryListKey],
      });
    },
    onError: (error: ErrorData) => {},
  });
};
