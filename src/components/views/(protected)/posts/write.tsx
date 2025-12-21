'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Collection } from './_components/Collection';
import { TWriteSchema, writeSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import { SELECTED_IMAGE } from '@/constants/tokens';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { usePostPosts } from '@/hook/posts/usePostPosts';

interface TProps {
  uuid: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const { mutateAsync: postPosts } = usePostPosts();
  const { data: categories } = useGetCategoryList();

  // 컴포넌트 마운트 시 localStorage에서 이미지 데이터 가져오기
  useEffect(() => {
    try {
      const storedImage = sessionStorage.getItem(SELECTED_IMAGE);
      if (storedImage) {
        setImage(storedImage);
      }
    } catch (error) {
      console.error('이미지 데이터 로드 실패:', error);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(writeSchema),
    mode: 'onChange',
    defaultValues: {
      image: image || '',
      categorySlug: '',
      content: '',
      tags: [] as string[],
      collectionIds: [],
    },
  });

  const onSubmit = async (data: TWriteSchema) => {
    console.log('제출 데이터:', selectedCollections);
    try {
      const formData = {
        ...data,
        collectionIds: selectedCollections,
      };
      await postPosts(formData);
      toast.success('게시물이 성공적으로 등록되었습니다.');
      router.push('/home'); // 게시물 목록 페이지로 이동
    } catch (error) {
      console.error('게시물 등록 오류:', error);
      toast.error('게시물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-3 flex flex-col items-center justify-center"
        >
          <div className="flex h-[240px] w-[240px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-04 bg-gray-02">
            <Icons.plus className="size-6 fill-gray-06" />
            <span className="font-xs-2 text-center text-gray-05">
              여기를 눌러서 <br />
              당신의 문장을 남겨주세요
            </span>
          </div>

          <div className="mt-8 flex w-full flex-col gap-8">
            <FormFields
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="categorySlug"
              label="카테고리"
              placeholder="카테고리를 선택해주세요."
              options={
                categories?.data?.content.map((item) => ({
                  value: item.slug,
                  label: item.name,
                })) || []
              }
            />

            <FormFields
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="content"
              label="내용"
              placeholder="내용을 작성해주세요."
              isVerified={false}
              maxCharacters={1000}
            />

            <FormFields
              fieldType={FormFieldType.KEYWORDS}
              control={form.control}
              name="tags"
              label="태그"
              placeholder="태그(선택)"
            />
          </div>

          <div className="mb-2 mt-12 flex w-full flex-col gap-2 pt-6">
            <FormLabel>컬렉션</FormLabel>
            <Collection
              selectedCollections={selectedCollections}
              setSelectedCollections={setSelectedCollections}
            />
          </div>
        </form>
      </Form>

      <div className="mt-[60px] pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          완료
        </Button>
      </div>
    </div>
  );
};
