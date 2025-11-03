'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { registerStep2Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const Step2 = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const { formState } = form;

  const onSubmit = () => {
    console.log(form.getValues());
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-l-1 text-black">비밀번호를 입력해주세요.</p>
        <p className="font-xs-2 text-gray-06">
          비밀번호는 8~20자 이내로, <br />
          영문·숫자·특수문자를 모두 포함해야 합니다.
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
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              placeholder="비밀번호를 입력해주세요"
            />

            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="passwordConfirm"
              placeholder="비밀번호를 한번 더 입력해주세요"
            />
          </form>
        </Form>
      </div>

      <div className="pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Step2;
