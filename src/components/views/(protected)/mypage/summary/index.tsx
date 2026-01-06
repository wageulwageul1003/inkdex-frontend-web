'use client';

import { useRouter } from 'next/navigation';

import { All } from './_components/All';
import { Monthly } from './_components/Monthly';
import { Yearly } from './_components/Yearly';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ISummaryProps {
  defaultValue: string;
}
export const SummaryComponent = ({ defaultValue }: ISummaryProps) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/summary/${value}`);
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">활동 요약</span>}
      />

      <Tabs
        defaultValue={defaultValue}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="">
          <TabsTrigger value="yearly">연간 기록</TabsTrigger>
          <TabsTrigger value="monthly">월간 기록</TabsTrigger>
          <TabsTrigger value="all">전체 기록</TabsTrigger>
        </TabsList>

        {/* 연간 기록 */}
        <TabsContent value="yearly" className="mt-5">
          <Yearly />
        </TabsContent>

        {/* 월간 기록 */}
        <TabsContent value="monthly" className="mt-5">
          <Monthly />
        </TabsContent>

        {/* 전체 기록 */}
        <TabsContent value="all" className="mt-5">
          <All />
        </TabsContent>
      </Tabs>
    </div>
  );
};
