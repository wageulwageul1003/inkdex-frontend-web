'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Calendar } from './_components/Calendar';
import { Collection } from './_components/Collection';
import { Feed } from './_components/Feed';

import { Alaram } from '@/components/shared/alaram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IMyInkdexProps {
  defaultValue: string;
}
export const MyInkdex = ({ defaultValue }: IMyInkdexProps) => {
  const router = useRouter();
  const handleTabChange = (value: string) => {
    router.push(`/my-inkdex/${value}`);
  };

  return (
    <div className="w-full bg-white px-4">
      <div className="flex justify-between py-3">
        <span className="font-l-1 text-black">나의 인덱스</span>
        <Alaram status={true} />
      </div>

      <div>
        <Tabs
          defaultValue={defaultValue}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="">
            <TabsTrigger value="feed">피드</TabsTrigger>
            <TabsTrigger value="calendar">캘린더</TabsTrigger>
            <TabsTrigger value="collection">컬렉션</TabsTrigger>
          </TabsList>

          {/* 피드 */}
          <TabsContent value="feed">
            <Feed />
          </TabsContent>

          {/* 캘린더 */}
          <TabsContent value="calendar">
            <Calendar />
          </TabsContent>

          {/* 컬렉션 */}
          <TabsContent value="collection">
            <Collection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
