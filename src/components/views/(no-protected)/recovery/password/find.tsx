'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

import { passwordResetSchema, TPasswordResetSchema } from './schema';

import CButton from '@/components/shared/CButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';
import { usePostPasswordReset } from '@/hooks/auth/find/password/usePostPasswordReset';

const RecoveryPasswordFindView: FC = () => {
  const router = useRouter();
  const { mutateAsync: postPasswordReset } = usePostPasswordReset();

  const form = useForm({
    resolver: zodResolver(passwordResetSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  });
  const { control, formState, handleSubmit } = form;

  const onSubmit = (values: TPasswordResetSchema) => {
    postPasswordReset(values);
    router.push(`/recovery/password/success`);
  };

  return (
    <div className="default-login-layout-content">
      <div className="flex flex-col items-start text-left">
        <p className="font-subtitle-bold">비밀번호 재설정</p>
      </div>
      <p className="font-caption mt-2 flex flex-col items-start text-gray-400">
        새로운 비밀번호를 설정할 수 있어요.
      </p>

      <div className="mt-8 flex flex-col items-start">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col space-y-5">
              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="newPassword"
                label="비밀번호"
                placeholder="영문, 숫자, 특수문자 조합 8자 이상"
              />

              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="newPasswordConfirm"
                label="비밀번호 확인"
                placeholder="비밀번호 재입력"
              />
            </div>
          </form>
        </Form>

        <CButton
          buttonType="contained"
          text="확인"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className={`mt-[80px] w-full rounded px-4 py-2 ${
            formState.isValid
              ? 'bg-gray-700 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
          disabled={!formState.isValid}
        />
      </div>
    </div>
  );
};

export default RecoveryPasswordFindView;
