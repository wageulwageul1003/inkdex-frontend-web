'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';

export const SummaryComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">활동 요약</span>}
      />
    </div>
  );
};
