'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { SetPasswordSchema, TSetPasswordSchema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostSetPassword } from '@/hooks/auth/usePostSetPassword';

export const CurrentPasswordResetComponent = () => {
  const router = useRouter();

  const { mutateAsync: setPassword } = usePostSetPassword();

  const form = useForm({
    resolver: zodResolver(SetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: TSetPasswordSchema) => {
    try {
      await setPassword({
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

      <p className="font-l-1 mt-4 text-black">
        변경할 비밀번호를 입력해주세요.
      </p>
      <p className="font-xs-2 mt-3 text-gray-06">
        비밀번호는 8~20자 이내로, <br />
        영문·숫자·특수문자를 모두 포함해야 합니다.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-[34px] flex flex-1 flex-col gap-2"
        >
          <FormFields
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            placeholder="비밀번호를 입력해주세요"
          />

          <FormFields
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            placeholder="비밀번호를 한번 더 입력해주세요"
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
          완료
        </Button>
      </div>
    </div>
  );
};
