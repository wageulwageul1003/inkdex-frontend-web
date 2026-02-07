'use client';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

interface NoticeItemProps {
  uuid: string;
  title: string;
  category: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
  type?: string;
}

export const NoticeItem = ({
  uuid,
  title,
  category,
  content,
  isExpanded,
  onToggle,
  type,
}: NoticeItemProps) => {
  // FAQ 카테고리
  //   const { constants: faqSupport } = use('const_faq_support');

  return (
    <div className={cn('w-full', isExpanded && 'px-1 pb-4 pt-3')}>
      <div
        className={cn(
          `group flex w-full items-center justify-between`,
          `cursor-pointer`,
          !isExpanded && 'px-1 py-5',
        )}
        onClick={onToggle}
      >
        <div className={cn(`flex-items flex flex-col`)}>
          <span className="font-body2 text-gray-04">[ 111 ]</span>
          <p className="font-m-1 text-gray-08">{title}</p>
        </div>
        {isExpanded ? (
          <Icons.keyboardArrowUp className="fill-gray-5 size-6 shrink-0" />
        ) : (
          <Icons.keyboardArrowDown className="fill-gray-5 size-6 shrink-0" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-2 bg-gray-01 px-5 py-4">
          <p className="font-m-2 text-gray-07">{content}</p>
        </div>
      )}
    </div>
  );
};
