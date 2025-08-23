'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { emailLoginSchema } from './schema';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostEmailLogin } from '@/hook/auth/usePostEmailLogin';

const EmailLogin = () => {
  const router = useRouter();
  const { mutateAsync: postEmailLogin } = usePostEmailLogin();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(emailLoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    try {
      const response = await postEmailLogin(form.getValues());

      if (response.success) {
        router.push('/');
      } else {
        setAlertMessage(
          '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
        );
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setAlertOpen(true);
    }
  };

  const { formState } = form;

  return (
    <div className="flex flex-col py-4">
      <p>환영합니다! inkdex입니다.</p>
      <div className="flex h-full flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className="w-full"
          >
            <div className="mt-8 flex flex-col gap-5">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="이메일"
                placeholder="이메일 입력"
              />

              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="비밀번호"
                placeholder="영문, 숫자, 특수문자 조합 8자 이상"
              />
            </div>
          </form>
        </Form>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          className={`mt-[80px] w-full rounded px-4 py-2 ${
            formState.isValid
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
          size="cta"
          variant="cta"
        >
          로그인
        </Button>
      </div>

      <CustomAlertDialog
        isOpen={alertOpen}
        onOpenChange={setAlertOpen}
        title="로그인 실패"
        description={alertMessage}
        confirmText="확인"
      />
    </div>
  );
};

export default EmailLogin;
