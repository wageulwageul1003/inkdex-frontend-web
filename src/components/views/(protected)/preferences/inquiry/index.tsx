'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const inquiryTabs = [
  { value: 'list', label: '문의하기' },
  { value: 'history', label: '문의내역' },
];

export const InquiryComponent = () => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <Header
        title={<span>1:1 문의</span>}
        left={
          <Icons.keyboardArrowLeft
            onClick={() => router.back()}
            className="size-6 fill-black"
          />
        }
      />
      <div className="mt-5 flex flex-1 flex-col gap-6">
        <Tabs
          value="list"
          //   onValueChange={(value) => console.log(value)}
          className="w-full"
        >
          <TabsList className="w-full">
            {inquiryTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="list">Tab 1</TabsContent>
          <TabsContent value="history">Tab 2</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
