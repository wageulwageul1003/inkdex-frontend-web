'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CollectionWriteSchema, TCollectionWriteSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostCollection } from '@/hook/collection/usePostCollection';

export const CollectionWriteComponent = () => {
  const router = useRouter();

  const { mutateAsync: postCollection } = usePostCollection();

  const form = useForm({
    resolver: zodResolver(CollectionWriteSchema),
    mode: 'onChange',
    defaultValues: {
      image: '',
      name: '',
    },
  });

  const onSubmit = async (data: TCollectionWriteSchema) => {
    try {
      await postCollection(data);
      router.back();
    } catch (error) {
      console.error('컬렉션 등록 오류:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.close
            className="size-6 fill-gray-06"
            onClick={() => router.back()}
          />
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-3 flex flex-col items-center justify-center"
        >
          <div className="flex h-[240px] w-[240px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-04 bg-gray-02">
            <Icons.plus className="size-6 fill-gray-06" />
            <span className="font-xs-2 text-center text-gray-05">
              대표 이미지 설정
            </span>
          </div>

          <div className="mt-8 flex w-full flex-col gap-8">
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="컬렉션 이름"
              placeholder="컬렉션 이름을 입력해주세요."
              maxCharacters={20}
            />
          </div>
        </form>
      </Form>

      <div className="mt-[60px] pb-[52px]">
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
