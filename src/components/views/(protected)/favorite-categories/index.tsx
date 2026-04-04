'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FavoriteCategoriesSchema, TFavoriteCategoriesSchema } from './schema';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { useGetFavoriteCategoryList } from '@/hooks/category/useGetFavoriteCategoryList';
import { usePatchFavoriteCategory } from '@/hooks/category/usePatchFavoriteCategory';

export const FavoriteCategoriesView = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryList();
  const { data: favoriteCategories } = useGetFavoriteCategoryList();
  const { mutateAsync: patchFavoriteCategory } = usePatchFavoriteCategory();

  const form = useForm<TFavoriteCategoriesSchema>({
    resolver: zodResolver(FavoriteCategoriesSchema),
    mode: 'onChange',
    defaultValues: {
      categoryUuids: [],
    },
  });

  useEffect(() => {
    form.reset({
      categoryUuids: favoriteCategories?.data.map((item) => item.uuid) || [],
    });
  }, [favoriteCategories]);

  const { control, formState } = form;

  const onSubmit = (data: TFavoriteCategoriesSchema) => {
    patchFavoriteCategory(data).then(() => {
      toast.success('관심 있는 카테고리를 변경하였습니다.');
      router.back();
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 fill-gray-06"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">관심 있는 카테고리</span>}
      />

      <div className="flex flex-1 flex-col">
        <div className="mt-10 flex flex-col gap-3">
          <div>
            <p className="font-l-1 text-black">어디서 마음에 남는 문장을</p>
            <p className="font-l-1 text-black">주로 발견하나요?</p>
          </div>
          <p className="font-xs-2 text-gray-06">
            관심 있는 카테고리를 1개 이상 선택해주세요.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-x-2 gap-y-4">
          <Controller
            name="categoryUuids"
            control={control}
            render={({ field }) => (
              <Chips
                items={
                  categories?.data?.map((item) => ({
                    value: item.uuid,
                    label: item.name,
                  })) || []
                }
                variant="multiple"
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
          className="w-full"
        >
          완료
        </Button>
      </div>
    </div>
  );
};
