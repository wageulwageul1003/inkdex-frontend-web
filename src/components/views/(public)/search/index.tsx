'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Recents } from './_components/Recents';
import { searchSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';

export const SearchView = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: z.infer<typeof searchSchema>) => {
    router.push(`/search/result/hot?searchKeyword=${data.searchKeyword}`);
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-3 pt-2">
          <FormFields
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="searchKeyword"
            placeholder="검색어를 입력해주세요."
            className="w-full"
          />
        </form>
      </Form>

      <Recents />
    </div>
  );
};
