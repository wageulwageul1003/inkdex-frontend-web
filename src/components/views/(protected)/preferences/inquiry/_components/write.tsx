'use client';

import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { inquirySchema } from './scheme';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export const InquiryWriteComponent = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(inquirySchema),
    mode: 'onChange',
    defaultValues: {
      searchKeyword: '',
    },
  });

  const { formState } = form;

  const onSubmit = async () => {
    console.log('onSubmit');
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        title={<span>문의하기</span>}
        left={
          <Icons.keyboardArrowLeft
            onClick={() => router.back()}
            className="size-6 fill-black"
          />
        }
      />
      <div className="mt-5 flex flex-1 flex-col gap-6">
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
                name="searchKeyword"
                label="이메일"
                placeholder="이메일 입력"
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
          size="default"
          variant="default"
        >
          로그인
        </Button>
      </div>
    </div>
  );
};
