'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/Header';

export const BlockView = () => {
  const router = useRouter();

  return (
    <div className="w-full flex-1 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={<span className="font-m-1 text-black">차단한 계정 관리</span>}
      />

      <div className="mt-5"></div>
    </div>
  );
};
