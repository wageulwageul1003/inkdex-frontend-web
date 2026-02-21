'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { inquirySchema, TInquirySchema } from './scheme';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { usePostInquiry } from '@/hooks/inquiry/usePostInquiry';
import { useAuth } from '@/providers/auth';

export const InquiryView = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { mutateAsync: postInquiry } = usePostInquiry();
  const { data: myProfile } = useGetMyProfile();

  const form = useForm({
    resolver: zodResolver(inquirySchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      content: '',
    },
  });

  const onSubmit = (data: TInquirySchema) => {
    postInquiry(data);
  };

  useEffect(() => {
    if (isLoggedIn && myProfile) {
      form.setValue('email', myProfile.email || '');
    }
  }, [isLoggedIn, myProfile]);

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        title={<span className="font-m-1 text-black">1:1 문의하기</span>}
        left={
          <Icons.ArrowBackIos
            onClick={() => router.back()}
            className="size-6 fill-gray-06"
          />
        }
      />
      <p className="font-s-1 mt-4 text-gray-08">
        문의하신 내용은 고객센터에서 확인 후 답변드립니다. <br />
        답변은 작성하신 이메일로 안내됩니다.
      </p>
      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className="mt-4 flex flex-col items-center justify-center"
          >
            <div className="flex w-full flex-col gap-6">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="답변 받을 이메일"
                placeholder="이메일을 입력해주세요."
              />

              <FormFields
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="content"
                label="내용"
                placeholder="내용을 작성해주세요."
                maxCharacters={1000}
              />

              <FormFields
                fieldType={FormFieldType.FILE}
                control={form.control}
                maxFiles={5}
                maxSizeInMB={10}
                name="files"
                label="첨부 파일"
                placeholder="첨부 파일을 선택해주세요."
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-16 pb-4">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};
