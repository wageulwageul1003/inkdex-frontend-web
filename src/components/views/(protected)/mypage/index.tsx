'use client';

import { useRouter } from 'next/navigation';

import { ActivityComponent } from './_components/Activity';
import { MyIndexComponent } from './_components/MyIndex';
import { StatisticsComponent } from './_components/Statistics';

import { Icons } from '@/components/shared/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyPageMenu = [
  { value: 'my-index', label: '나의 인덱스' },
  { value: 'statistics', label: '통계' },
  { value: 'activity', label: '활동' },
];

const MyPageComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between py-2">
        <p>마이페이지</p>
        <div className="flex gap-5">
          <Icons.bell className="size-6" />
          <Icons.bell
            className="size-6"
            onClick={() => router.push('/preferences')}
          />
        </div>
      </div>

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
