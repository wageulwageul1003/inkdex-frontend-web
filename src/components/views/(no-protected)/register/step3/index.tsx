'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { registerStep2Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const Step3 = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  const { formState } = form;

  const onSubmit = () => {
    console.log(form.getValues());
  };

  return (
    <div className="default-layout-content flex flex-1 flex-col bg-gray-01">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-l-1 text-black">이름을 입력해주세요.</p>
        <p className="font-xs-2 text-gray-06">
          계정 식별 및 서비스 이용에 사용됩니다.
        </p>
      </div>

      <div className="mt-[50px] flex flex-1 flex-col">
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
              name="name"
              placeholder="이름을 입력해주세요"
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

export default Step3;
