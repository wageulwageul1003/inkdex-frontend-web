'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { emailLoginSchema } from './schema';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { USER_ID } from '@/constants/tokens';
import { usePostEmailLogin } from '@/hook/auth/usePostEmailLogin';

const EmailLogin = () => {
  const router = useRouter();
  const { mutateAsync: postEmailLogin } = usePostEmailLogin();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(emailLoginSchema),
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    try {
      const response = await postEmailLogin(form.getValues());

      if (response.code === 200) {
        router.push('/home');
        Cookies.set(USER_ID, response.data.content.id);
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
    <div className="default-layout-content flex flex-1 flex-col bg-gray-01">
      <div className="flex py-3">
        <span onClick={() => router.push('/login')}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-1 pb-8">
        <p className="font-l-1 text-black">이메일로 시작하기</p>
        <p className="font-xs-2 text-gray-06">
          로그인하고 서비스를 계속 이용해보세요.
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
          >
            <div className="flex flex-col gap-5">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                placeholder="아이디 입력"
              />

              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                placeholder="비밀번호 입력"
              />
            </div>
          </form>
        </Form>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          className={`mt-4`}
          size="lg"
          variant="contained"
        >
          로그인
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2">
          <p className="font-xs-2 text-gray-06">비밀번호를 잊으셨나요?</p>
          <Button
            variant="buttonText"
            size="buttonText"
            className="font-xs-2 border-b border-gray-08 text-gray-08"
          >
            비밀번호 찾기
          </Button>
        </div>
      </div>

      <div className="pb-[52px]">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/register/step1')}
        >
          회원가입 하기
        </Button>
      </div>

      <CustomAlertDialog
        isOpen={alertOpen}
        onOpenChange={setAlertOpen}
        title="로그인 실패"
        description={alertMessage}
        cancelText="확인"
        confirmText="확인"
        onConfirm={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default EmailLogin;
