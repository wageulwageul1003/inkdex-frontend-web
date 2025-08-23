'use client';

import { useSearchParams } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';

export default function Terms() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  return (
    <div>
      <Header
        title={<span>약관 동의</span>}
        right={<Icons.close className="size-6 fill-black" />}
      />
      <h1>{uuid}</h1>
    </div>
  );
}
