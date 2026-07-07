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
import { useGetEmotionList } from '@/hooks/emotion/useGetEmotionList';
import { Visibility } from './_components/Visibility';
import { VISIBILITY, VisibilityType } from '@/constants/enum';

interface TProps {
  uuid?: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const router = useRouter();
  const [selectedCollections, setSelectedCollections] = useState<
    ICollectionListResponse[]
  >([]);
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityType>(
    VISIBILITY[0].value,
  );
  const { mutateAsync: postPosts } = usePostPosts();
  const { data: emotions } = useGetEmotionList();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const form = useForm({
    resolver: zodResolver(writeSchema),
    mode: 'onChange',
    defaultValues: {
      imageUrl: '',
      categoryUuid: '',
      content: '',
      tags: [] as string[],
      collectionUuid: [],
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
          form.setValue('imageUrl', 'file-selected');
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
        form.setValue('imageUrl', 'file-selected');
      }
    }
  };

  const onSubmit = async (data: TWriteSchema) => {
    try {
      await postPosts({
        ...data,
        collectionUuid: selectedCollections.map(
          (collection) => collection.uuid,
        ),
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
    <div className="no-scrollbar flex flex-1 flex-col bg-white px-4">
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
              className="flex h-[240px] w-[240px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-04 bg-white"
              onClick={() => handleImageSelect()}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-02">
                <Icons.camera className="size-6 fill-sand-06" />
              </span>
              <span className="font-s-2 text-center text-gray-05">
                필사 사진을 올려주세요
              </span>
            </div>
          )}

          <div className="mt-8 flex w-full flex-col gap-8">
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="source"
              label="어디에서 만난 글인가요?"
              placeholder="책 제목, 작품명, 출처 등을 입력해주세요."
              required
            />

            {/* TODO: 엔터가 안먹는다.. ㅜ */}
            <FormFields
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reflection"
              label="이 글이 나에게 닿은 이유"
              placeholder="이 글이 나에게 닿은 이유를 남겨보세요.\n한 줄만 남겨도 좋아요."
              maxCharacters={1000}
              required
            />

            <FormFields
              fieldType={FormFieldType.CHIP}
              control={form.control}
              name="source"
              label="어디에서 만난 글인가요?"
              placeholder="책 제목, 작품명, 출처 등을 입력해주세요."
              required
              options={
                emotions?.data.map((item) => {
                  return {
                    label: item.name,
                    value: item.uuid,
                  };
                }) ?? []
              }
            />

            <FormFields
              fieldType={FormFieldType.KEYWORDS}
              control={form.control}
              name="tags"
              label="태그"
              labelSlot={
                <span className="font-s-2 text-gray-06">
                  이 글을 기억할 키워드를 남겨보세요.
                </span>
              }
              placeholder="태그(선택)"
            />
          </div>

          <div className="mb-6 mt-6 flex w-full flex-col gap-2 pt-6">
            <FormLabel>컬렉션</FormLabel>
            <Collection
              selectedCollections={selectedCollections}
              setSelectedCollections={setSelectedCollections}
            />
          </div>

          <div className="mt-6 flex w-full flex-col gap-2">
            <FormLabel>공개 범위</FormLabel>
            <Visibility
              selectedVisibility={selectedVisibility}
              setSelectedVisibility={setSelectedVisibility}
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
