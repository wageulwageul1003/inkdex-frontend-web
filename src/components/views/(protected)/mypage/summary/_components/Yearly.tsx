import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

export const Yearly = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* 년도 헤더 영역 */}
      <div className="flex h-10 items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.keyboardArrowLeft className="size-6" />
          </Button>
          <span className="font-m-1 text-gray-10">2025년</span>
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.keyboardArrowRight className="size-6" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Icons.inbox className="size-4 fill-gray-05" />
          <span className="font-xs-2 text-gray-05">33개</span>
        </div>
      </div>
    </div>
  );
};
