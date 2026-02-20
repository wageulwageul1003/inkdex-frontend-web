'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CurrentPasswordSchema, TCurrentPasswordSchema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostCheckCurrentPassword } from '@/hooks/auth/usePostCheckCurrentPassword';

export const CurrentPasswordView = () => {
  const router = useRouter();

  const { mutateAsync: checkCurrentPassword } = usePostCheckCurrentPassword();

  const form = useForm({
    resolver: zodResolver(CurrentPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
    },
  });

  const onSubmit = async (data: TCurrentPasswordSchema) => {
    try {
      await checkCurrentPassword({
        ...data,
      }).then(() => {
        router.push('/preferences/account/set-password');
      });
    } catch (error) {
      console.error('컬렉션 등록 오류:', error);
    }
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
        title={<span className="font-m-1 text-black">비밀번호 설정</span>}
      />

      <p className="font-l-1 mt-4 text-black">기존 비밀번호를 입력해주세요.</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-[34px] flex flex-1 flex-col"
        >
          <FormFields
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="currentPassword"
            placeholder="비밀번호를 입력해주세요"
          />
        </form>
      </Form>

      <div className="py-2 pb-3">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
        >
          다음
        </Button>
      </div>
    </div>
  );
};
