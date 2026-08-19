'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Follower } from './_components/Follower';
import { Following } from './_components/Following';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { Button } from '@/components/ui/button';

interface IFollow {
  type: string;
}

export const FollowView = (props: IFollow) => {
  const router = useRouter();
  const { data: myProfile } = useGetMyProfile();
  const [defaultTab, setDefaultTab] = React.useState(props.type);

  const handleTabChange = (value: string) => {
    setDefaultTab(value);
    router.push(`/my/${value}`);
  };

  return (
    <div className="w-full flex-1 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={myProfile?.data.nickname}
        right={
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/block`)}
          >
            차단 관리
          </Button>
        }
      />

      <div className="mt-5">
        <Tabs
          defaultValue={defaultTab}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="">
            <TabsTrigger value="follower">
              팔로워 {myProfile?.data.followerCount || 0}
            </TabsTrigger>
            <TabsTrigger value="following">
              팔로잉 {myProfile?.data.followingCount || 0}
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
