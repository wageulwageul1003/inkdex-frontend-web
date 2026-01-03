'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Follower } from './_components/Follower';
import { Following } from './_components/Following';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';

interface IFollow {
  type: 'follower' | 'following';
}

export const Follow = (props: IFollow) => {
  const router = useRouter();
  const { data: myProfile } = useGetMyProfile();
  const [defaultTab, setDefaultTab] = React.useState(props.type);

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
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="">
            <TabsTrigger value="follower">
              팔로워 {myProfile?.followerCount || 0}
            </TabsTrigger>
            <TabsTrigger value="following">
              팔로잉 {myProfile?.followingCount || 0}
            </TabsTrigger>
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
