'use client';

import { useGetCategoryList } from '../category/useGetCategoryList';

/**
 * 카테고리 slug를 입력받아 해당하는 카테고리 이름을 반환하는 훅
 * @param slug 카테고리 slug
 * @returns 카테고리 이름 또는 빈 문자열
 */
export const useGetCategoryLabel = (slug: string): string => {
  const { data: categoryList } = useGetCategoryList();

  const getCategoryLabel = (categoryList: any, slug: string): string => {
    if (!categoryList?.data?.content || !slug) return '';

    const category = categoryList.data.content.find(
      (category: { slug: string; name: string }) => category.slug === slug,
    );

    return category?.name || '';
  };

  return getCategoryLabel(categoryList, slug);
};
