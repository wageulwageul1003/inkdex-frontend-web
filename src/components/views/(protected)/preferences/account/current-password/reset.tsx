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
import { toast } from '@/components/ui/sonner';
import { usePatchSetPassword } from '@/hooks/auth/usePatchSetPassword';

export const CurrentPasswordResetView = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const currentPassword = searchParams.get('currentPassword');

  const { mutateAsync: patchSetPassword } = usePatchSetPassword();

  const form = useForm({
    resolver: zodResolver(SetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: currentPassword || '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TSetPasswordSchema) => {
    try {
      await patchSetPassword({
        ...data,
      }).then(() => {
        router.push('/preferences');
        toast.success('비밀번호 변경이 완료되었어요.');
      });
    } catch (error) {
      console.log(error);
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
            name="newPassword"
            placeholder="비밀번호를 입력해주세요"
          />

          <FormFields
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="confirmPassword"
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
