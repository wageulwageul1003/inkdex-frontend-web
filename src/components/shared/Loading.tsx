'use client';

import { cn } from '@/lib/utils';

export const Loading = () => (
  <div
    className="fixed inset-0 top-[60px] z-50 flex items-center justify-center bg-white/80"
    aria-label="로딩 중"
  >
    <div className="relative">
      <div
        className={cn(
          'h-12 w-12 rounded-full',
          'border-4 border-gray-200 border-t-black',
          'animate-spin',
          'relative',
        )}
      >
        <span className="sr-only">로딩 중...</span>
      </div>
    </div>
  </div>
);
