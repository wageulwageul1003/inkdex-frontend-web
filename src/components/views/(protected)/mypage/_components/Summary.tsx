'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

import MyHeader from './MyHeader';

import Chips from '@/components/shared/chips';

export const Summary = () => {
  const router = useRouter();
  const [mode, setMode] = useState('yearly');

  return (
    <div className="mt-4">
      <MyHeader title="활동 요약" onClick={() => router.push('/')} />

      {/* chip */}
      <div className="mt-2 flex items-center gap-2">
        <Chips
          items={[
            { value: 'yearly', label: '올해의 기록' },
            { value: 'monthly', label: '이번 달의 기록' },
          ]}
          variant="single"
          type="text"
          selected={mode}
          onChange={(item) => setMode(item as string)}
        />
      </div>

      {/* summary result */}
      <div className="mt-4"></div>
    </div>
  );
};
