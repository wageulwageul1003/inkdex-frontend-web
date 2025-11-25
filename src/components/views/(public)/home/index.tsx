'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Recommend } from './_components/Recommend';

import { Alaram } from '@/components/shared/alaram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <div className="flex justify-between py-3">
        <span className="font-l-1 text-black">피드</span>
        <Alaram status={true} />
      </div>

      <div>
        <Tabs defaultValue="recommend" className="w-full">
          <TabsList className="">
            <TabsTrigger value="recommend">추천</TabsTrigger>
            <TabsTrigger value="latest">최신</TabsTrigger>
            <TabsTrigger value="follow">팔로우</TabsTrigger>
          </TabsList>

          {/* 추천 */}
          <TabsContent value="recommend">
            <Recommend />
          </TabsContent>

          {/* 최신 */}
          <TabsContent value="latest"></TabsContent>

          {/* 팔로우 */}
          <TabsContent value="follow"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
