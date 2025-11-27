'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { resetPasswordSchema, TResetPasswordSchema } from './schema';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostResetPassword } from '@/hook/auth/usePostResetPassword';
import { ErrorData } from '@/utils/fetch';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: postResetPassword } = usePostResetPassword();
  const [alertOpen, setAlertOpen] = useState(false);

  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  });

  const { control, formState } = form;

  const onSubmit = async (data: TResetPasswordSchema) => {
    try {
      const response = await postResetPassword(data);
      if (response.code === 'success.account.reset_password') {
        router.push('/reset-password/success');
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 'error.user.not_found') {
        setAlertOpen(true);
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mt-10 flex flex-col gap-3">
          <p className="font-l-1 text-black">비밀번호 찾기 </p>
          <p className="font-xs-2 text-gray-06">
            가입하신 이메일을 입력해 주세요. <br />
            입력한 이메일로 비밀번호 재설정 메일이 발송됩니다.
          </p>
        </div>

        <div className="mt-[34px] flex flex-1 flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log('Validation Errors:', errors);
              })}
              className="flex flex-col gap-2"
            >
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                placeholder="이메일을 입력해주세요"
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <div className="flex items-center gap-2">
          <span className="font-xs-2 text-gray-06">
            가입된 이메일을 찾을 수 없나요?
          </span>
          <Button
            variant="buttonText"
            size="buttonText"
            className="font-xs-2 border-b border-gray-08 text-gray-08"
            onClick={() => router.push('/reset-password')}
          >
            1:1 문의하기
          </Button>
        </div>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
          className="w-full"
        >
          이메일 전송
        </Button>
      </div>

      <CustomAlertDialog
        isOpen={alertOpen}
        onOpenChange={setAlertOpen}
        title="등록된 이메일이 아닙니다"
        description={
          <>
            해당 이메일로 가입된 이력이 없어요.
            <br />
            정확한 이메일로 다시 시도해 주세요.
          </>
        }
        cancelText="확인"
        confirmText="확인"
        onConfirm={() => setAlertOpen(false)}
        type="warning"
      ></CustomAlertDialog>
    </div>
  );
};

export default ResetPassword;
