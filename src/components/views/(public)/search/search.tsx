'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Hot } from './_components/result/Hot';
import { searchSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SearchResult = () => {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: z.infer<typeof searchSchema>) => {
    console.log(data);
  };

  return (
    <div className="w-full bg-white px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-3 pt-2">
          <FormFields
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="searchKeyword"
            placeholder="검색어를 입력해주세요."
            className="mt-2 w-full"
          />
        </form>
      </Form>

      <Tabs defaultValue="hot" className="mt-3 w-full">
        <TabsList className="">
          <TabsTrigger value="hot">인기</TabsTrigger>
          <TabsTrigger value="latest">최신</TabsTrigger>
          <TabsTrigger value="user">사용자</TabsTrigger>
        </TabsList>

        {/* 인기 */}
        <TabsContent value="hot">
          <Hot />
        </TabsContent>

        {/* 최신 */}
        <TabsContent value="latest"></TabsContent>

        {/* 사용자 */}
        <TabsContent value="user"></TabsContent>
      </Tabs>
    </div>
  );
};
