'use client';

import { useRouter } from 'next/navigation';

import { ActivityComponent } from './_components/Activity';
import { MyIndexComponent } from './_components/MyIndex';
import { StatisticsComponent } from './_components/Statistics';

import { Alaram } from '@/components/shared/alaram';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyPageMenu = [
  { value: 'my-index', label: '나의 인덱스' },
  { value: 'statistics', label: '통계' },
  { value: 'activity', label: '활동' },
];

const MyPageComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={<span className="font-l-1 text-black">마이페이지</span>}
        right={
          <span className="flex items-center gap-2">
            <Alaram status={true} />
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => router.push('/preferences')}
            >
              <Icons.settings className="size-6 fill-gray-08" />
            </Button>
          </span>
        }
      />

      <div className="flex flex-1 flex-col">
        <Tabs defaultValue="my-index">
          <TabsList>
            {MyPageMenu.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="my-index">
            <MyIndexComponent />
          </TabsContent>
          <TabsContent value="statistics">
            <StatisticsComponent />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPageComponent;
