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
      bio: '',
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
      await patchProfile({
        ...data,
        imageFile: imageFileRef.current || undefined,
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
      setPreviewUrl(myProfile.profileImageUrl);
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
      <div className="mt-[40px]"></div>
      <div className="flex items-center justify-center">
        <div
          className="relative flex h-[146px] w-[146px] cursor-pointer items-center justify-center rounded-full bg-gray-03"
          onClick={handleImageSelect}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필 이미지"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Icons.person className="z-10 size-[146px] fill-white" />
          )}
          <div className="absolute bottom-0 right-0 z-10 rounded-full bg-gray-04 p-1.5">
            <Icons.camera className="size-6 fill-white" />
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-[34px] flex flex-1 flex-col"
        >
          <FormFields
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            maxCharacters={10}
          />

          <span className="font-xs-2 mt-2 text-gray-05">
            공백 포함 최대 10자까지 입력할 수 있습니다.
          </span>

          <FormFields
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="bio"
            label="자기소개"
            placeholder="당신의 소개를 적어보세요."
            maxCharacters={100}
            className="mt-6"
          />
        </form>
      </Form>

      <div className="flex flex-col items-center pb-4 pt-[50px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
        >
          완료
        </Button>
      </div>
    </div>
  );
};
