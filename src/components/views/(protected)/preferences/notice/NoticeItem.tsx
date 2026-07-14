'use client';

import { cn } from '@/lib/utils';

interface NoticeItemProps {
  uuid: string;
  title: string;
  category: string;
  content: string;
}

export const NoticeItem = ({ title, category, content }: NoticeItemProps) => {
  // TODO: ui 수정

  return (
    <div className={cn('w-full')}>
      <p>{title}</p>
      <p>{category}</p>
      <p>{content}</p>
    </div>
  );
};
