'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';

interface MyPageProps {
  uuid?: string;
}

export const MyOtherPageView = ({ uuid }: MyPageProps) => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={<Icons.ArrowBackIos className="size-6 fill-gray-08" />}
        right={<Icons.arrowLeftAlt />}
      />
    </div>
  );
};
