'use client';

import { useRouter } from 'next/navigation';

import { MyProfile } from '../_components/MyProfile';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OtherProfileCollection } from './_components/OtherProfileCollection';

interface MyPageProps {
  uuid?: string;
  defaultValue: string;
}

export const MyOtherPageView = ({ uuid, defaultValue }: MyPageProps) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/my/${uuid}/${value}`);
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <span className="flex items-center">
            <Icons.ArrowBackIos
              className="size-6 fill-gray-08"
              onClick={() => router.back()}
            />
          </span>
        }
        right={<Icons.arrowLeftAlt />}
      />
      <MyProfile uuid={uuid} />

      <Tabs
        defaultValue={defaultValue}
        onValueChange={handleTabChange}
        className="mt-12 w-full"
      >
        <TabsList className="">
          <TabsTrigger value="feed">피드</TabsTrigger>
          <TabsTrigger value="calendar">캘린더</TabsTrigger>
          <TabsTrigger value="collection">컬렉션</TabsTrigger>
        </TabsList>

        {/* 피드 */}
        {/* <TabsContent value="feed">
          <Feed />
        </TabsContent> */}

        {/* 캘린더 */}
        {/* <TabsContent value="calendar">
          <Calendar />
        </TabsContent> */}

        {/* 컬렉션 */}
        <TabsContent value="collection">
          <OtherProfileCollection accountUuid={uuid!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
