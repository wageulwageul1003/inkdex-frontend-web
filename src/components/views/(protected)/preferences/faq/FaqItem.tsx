'use client';

import { Icons } from '@/components/shared/icons';
import { IFaqListResponse } from '@/hooks/faq/useGetFaqList';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FaqItemProps {
  item: IFaqListResponse;
}

export const FaqItem = ({ item }: FaqItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div
        className={cn(
          'group flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3',
        )}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex flex-col">
          <span className="font-s-2 text-sand-08">{item.category.name}</span>
          <p className="font-m-1 text-gray-08">{item.question}</p>
        </div>

        {isExpanded ? (
          <Icons.keyboardArrowUp className="fill-gray-5 size-6 shrink-0" />
        ) : (
          <Icons.keyboardArrowDown className="fill-gray-5 size-6 shrink-0" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-2 bg-gray-01 px-5 py-4">
          <p
            className="font-m-2 text-gray-07"
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>
      )}
    </div>
  );
};
