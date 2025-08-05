'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Hot } from './_components/Hot';
import { Recents } from './_components/Recents';
import { Recommends } from './_components/Recommends';
import { searchSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Form } from '@/components/ui/form';

export const Search = () => {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: z.infer<typeof searchSchema>) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex w-full items-center justify-between gap-4">
        <Icons.keyboardArrowLeft className="size-6 fill-black" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex-1"
          >
            <div className="flex items-center rounded-[16px] border border-gray-400">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="searchKeyword"
                placeholder="검색어를 입력해주세요."
                className="w-full"
              />
            </div>
          </form>
        </Form>
      </div>

      <Recents />

      <Recommends />

      <Hot />
    </div>
  );
};
