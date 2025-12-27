'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Follower } from './_components/Follower';
import { Following } from './_components/Following';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyProfile } from '@/hook/auth/useGetMyProfile';

export const Follow = () => {
  const router = useRouter();
  const { data: myProfile } = useGetMyProfile();

  return (
    <div className="w-full flex-1 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={myProfile?.nickname}
      />

      <div className="mt-5">
        <Tabs defaultValue="follower" className="w-full">
          <TabsList className="">
            <TabsTrigger value="follower">팔로워</TabsTrigger>
            <TabsTrigger value="following">팔로잉</TabsTrigger>
          </TabsList>

          <TabsContent value="follower">
            <Follower />
          </TabsContent>
          <TabsContent value="following">
            <Following />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
