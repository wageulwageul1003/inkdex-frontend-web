'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { EditProfileSchema, TEditProfileSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { usePatchProfile } from '@/hooks/auth/usePatchProfile';
import { isApp } from '@/lib/device';
import { nativeBridge } from '@/lib/native-bridge';

export const EditProfileComponent = () => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);
  const { data: myProfile } = useGetMyProfile();

  const { mutateAsync: patchProfile } = usePatchProfile();

  const form = useForm({
    resolver: zodResolver(EditProfileSchema),
    mode: 'onChange',
    defaultValues: {
      image: '',
      nickname: '',
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

  const onSubmit = async (data: TEditProfileSchema) => {
    try {
      if (!imageFileRef.current) {
        return;
      }

      await patchProfile({
        ...data,
        imageFile: imageFileRef.current,
      }).then(() => {
        router.back();
      });
    } catch (error) {
      console.error('컬렉션 등록 오류:', error);
    }
  };

  useEffect(() => {
    if (myProfile) {
      form.reset({
        ...myProfile,
      });
    }
  }, [myProfile]);

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 fill-gray-06"
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
                대표 이미지 설정
              </span>
            </div>
          )}

          <div className="mt-8 flex w-full flex-col gap-8">
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="컬렉션 이름"
              placeholder="컬렉션 이름을 입력해주세요."
              maxCharacters={20}
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
          disabled={!form.formState.isValid}
        >
          완료
        </Button>
      </div>
    </div>
  );
};
