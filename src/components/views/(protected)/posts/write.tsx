'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { TWriteSchema, writeSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SELECTED_IMAGE } from '@/constants/tokens';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { usePostPosts } from '@/hook/posts/usePostPosts';

interface TProps {
  uuid: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const { uuid } = props;
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
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
    },
  });

  const onSubmit = async (data: TWriteSchema) => {
    try {
      setIsSubmitting(true);
      console.log('제출 데이터:', data);
      await postPosts(data);
      toast.success('게시물이 성공적으로 등록되었습니다.');
      router.push('/home'); // 게시물 목록 페이지로 이동
    } catch (error) {
      console.error('게시물 등록 오류:', error);
      toast.error('게시물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        left={
          <Icons.close
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
        title={<span>글쓰기</span>}
        right={
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            size="cta"
            variant="cta"
            className="px-3 py-2"
          >
            업로드
          </Button>
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-6"
        >
          <div className="relative aspect-square rounded-[24px]">
            <Image
              src={image || '/default-image.png'}
              alt="post-image"
              width={100}
              height={100}
              className="w-full rounded-[24px]"
            />

            <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600">
              <Icons.close
                className="size-4 fill-white"
                onClick={() => setImage(null)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
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
              placeholder="내용을 입력해주세요."
              maxCharacters={1000}
            />

            <FormFields
              fieldType={FormFieldType.KEYWORDS}
              control={form.control}
              name="tags"
              label="태그"
              placeholder="태그를 입력해주세요."
              maxCount={10}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
