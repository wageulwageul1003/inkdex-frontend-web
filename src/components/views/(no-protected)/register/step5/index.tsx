'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep5Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetNicknameDuplicateCheck } from '@/hooks/auth/useGetNicknameDuplicateCheck';
import { isApp } from '@/lib/device';
import { nativeBridge } from '@/lib/native-bridge';
import { ErrorData } from '@/utils/fetch';

const Step5 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);
  const { mutateAsync: checkNicknameDuplicate } =
    useGetNicknameDuplicateCheck();

  const form = useForm({
    resolver: zodResolver(registerStep5Schema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
    },
  });
  const { formState } = form;

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
        }
      };
      input.click();
    } else {
      const result = await nativeBridge.openGallery();
      if (result) {
        const imageData = result.base64 || result.uri;
        setPreviewUrl(imageData);
        const response = await fetch(imageData);
        const blob = await response.blob();
        imageFileRef.current = new File([blob], 'image.jpg', {
          type: blob.type || 'image/jpeg',
        });
      }
    }
  };

  const onSubmit = async () => {
    try {
      const nickname = form.getValues('nickname');
      const result = await checkNicknameDuplicate(nickname);

      if (!result?.data?.content) {
        const profileImage = previewUrl
          ? encodeURIComponent(previewUrl)
          : searchParams.get('profileImage') || '';

        router.push(
          `/register/step6?email=${searchParams.get('email')}&password=${searchParams.get('password')}&fullName=${searchParams.get('fullName')}&agreedTermIds=${searchParams.get('agreedTermIds')}&nickname=${nickname}&profileImage=${profileImage}`,
        );
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 'error.account.nickname_duplicate') {
        form.setError('nickname', {
          type: 'manual',
          message: '이미 사용 중인 닉네임입니다.',
        });
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="mt-[58px]"></div>
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
        </form>
      </Form>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <span className="font-s-2 text-gray-07">
          프로필 정보는 나중에 다시 수정할 수 있어요!
        </span>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
          className="w-full"
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Step5;
