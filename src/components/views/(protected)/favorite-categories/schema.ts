import { z } from 'zod';

export const FavoriteCategoriesSchema = z.object({
  preferredCategorySlugs: z
    .array(z.string())
    .min(1, '관심 있는 카테고리를 1개 이상 선택해주세요'),
});

export type TFavoriteCategoriesSchema = z.infer<
  typeof FavoriteCategoriesSchema
>;
