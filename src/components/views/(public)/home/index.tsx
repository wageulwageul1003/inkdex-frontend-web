'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Following } from './_components/Following';
import { Latest } from './_components/Latest';
import { Recommend } from './_components/Recommend';

import { Notification } from '@/components/shared/Notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IHomeProps {
  defaultValue: string;
}

export const Home = ({ defaultValue }: IHomeProps) => {
  const router = useRouter();
  const handleTabChange = (value: string) => {
    router.push(`/home/${value}`);
  };

  return (
    <div className="w-full bg-white px-4">
      <div className="flex justify-between py-3">
        <span className="font-l-1 text-black">피드</span>
        <Notification />
      </div>

      <div>
        <Tabs
          defaultValue={defaultValue}
          className="w-full"
          onValueChange={handleTabChange}
        >
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
          <TabsContent value="latest">
            <Latest />
          </TabsContent>

          {/* 팔로우 */}
          <TabsContent value="follow">
            <Following />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
