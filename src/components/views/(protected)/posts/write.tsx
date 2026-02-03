'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Collection } from './_components/Collection';
import { TWriteSchema, writeSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { ICollectionListResponse } from '@/hooks/collection/useGetCollectionList';
import { usePostPosts } from '@/hooks/posts/usePostPosts';
import { isApp } from '@/lib/device';
import { nativeBridge } from '@/lib/native-bridge';

interface TProps {
  uuid?: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const router = useRouter();
  const [selectedCollections, setSelectedCollections] = useState<
    ICollectionListResponse[]
  >([]);
  const { mutateAsync: postPosts } = usePostPosts();
  const { data: categories } = useGetCategoryList();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const form = useForm({
    resolver: zodResolver(writeSchema),
    mode: 'onChange',
    defaultValues: {
      image: '',
      categorySlug: '',
      content: '',
      tags: [] as string[],
      collectionIds: [],
    },
  });

  const handleImageSelect = async () => {
    if (!isApp()) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(file));
          imageFileRef.current = file;
          form.setValue('image', 'file-selected');
        }
      };
      input.click();
    } else {
      const result = await nativeBridge.openGallery();
      if (result) {
        const imageData = result.base64 || result.uri;
        setPreviewUrl(imageData);
        // base64를 File로 변환
        const response = await fetch(imageData);
        const blob = await response.blob();
        imageFileRef.current = new File([blob], 'image.jpg', {
          type: blob.type || 'image/jpeg',
        });
        form.setValue('image', 'file-selected');
      }
    }
  };

  const onSubmit = async (data: TWriteSchema) => {
    try {
      if (!imageFileRef.current) {
        toast.error('이미지를 선택해주세요.');
        return;
      }
      await postPosts({
        ...data,
        collectionIds: selectedCollections.map(
          (collection) => collection.collectionId,
        ),
        imageFile: imageFileRef.current,
      });
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
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="h-[240px] w-[240px] rounded-lg object-cover"
              onClick={() => handleImageSelect()}
            />
          ) : (
            <div
              className="flex h-[240px] w-[240px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-04 bg-gray-02"
              onClick={() => handleImageSelect()}
            >
              <Icons.plus className="size-6 fill-gray-06" />
              <span className="font-xs-2 text-center text-gray-05">
                여기를 눌러서 <br />
                당신의 문장을 남겨주세요
              </span>
            </div>
          )}

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
