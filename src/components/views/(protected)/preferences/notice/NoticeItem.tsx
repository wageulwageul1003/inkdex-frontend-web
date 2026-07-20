'use client';

import { INoticeListResponse } from '@/hooks/notice/useGetNoticeList';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

interface NoticeItemProps {
  item: INoticeListResponse;
}

export const NoticeItem = ({ item }: NoticeItemProps) => {
  const router = useRouter();
  return (
    <div
      className={'flex w-full flex-col px-1 py-3'}
      onClick={() => router.push(`/preferences/notice/${item.uuid}`)}
    >
      <div className="flex items-center justify-between">
        <span className="font-xs-2 text-sand-08">{item.category.name}</span>

        <p className="font-xs-2 text-gray-05">
          {dayjs(item.createdAt).format('YYYY-MM-DD')}
        </p>
      </div>
      <p className="font-m-1 mt-0.5 line-clamp-2 text-gray-08">{item.title}</p>
    </div>
  );
};
