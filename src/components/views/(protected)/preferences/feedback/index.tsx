'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { feedbackSchema, TFeedbackSchema } from './scheme';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export const FeedbackComponent = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: TFeedbackSchema) => {
    console.log(data);
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        title={<span className="font-m-1 text-black">의견보내기</span>}
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
      />

      <h1 className="font-s-1 mt-7 text-gray-08">
        앱을 사용하면서 불편했던 점이나 개선하면 좋을 것 같은 점, 필요하다고
        생각하는 기능을 남겨주세요!
      </h1>

      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className="mt-4 flex flex-col items-center justify-center"
          >
            <div className="flex w-full flex-col">
              <FormFields
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="content"
                placeholder="내용을 작성해주세요."
                maxCharacters={1000}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <span className="font-s-2 text-gray-07">
          보내주신 의견은 서비스 개선에 반영하겠습니다 :)
        </span>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          완료
        </Button>
      </div>
    </div>
  );
};
