'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { registerStep5Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetNicknameDuplicateCheck } from '@/hook/auth/useGetNicknameDuplicateCheck';
import { ErrorData } from '@/utils/fetch';

const Step5 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const onSubmit = async () => {
    try {
      const nickname = form.getValues('nickname');
      const result = await checkNicknameDuplicate(nickname);

      if (!result?.data?.content) {
        router.push(
          `/register/step6?email=${searchParams.get('email')}&password=${searchParams.get('password')}&fullName=${searchParams.get('fullName')}&agreedTermIds=${searchParams.get('agreedTermIds')}&nickname=${nickname}&profileImage=${searchParams.get('profileImage')}`,
        );
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.error === 'error.account.nickname_duplicate') {
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
        <div className="relative flex h-[146px] w-[146px] items-center justify-center rounded-full bg-gray-03">
          <Icons.person className="z-10 size-[146px] fill-white" />
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
          className="mt-[34px] flex flex-1 flex-col gap-2"
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
