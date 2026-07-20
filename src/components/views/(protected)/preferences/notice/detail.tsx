'use client';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetNoticeDetail } from '@/hooks/notice/useGetNoticeDetail';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface TProps {
  noticeUuid: string;
}

export const NoticeDetail: FC<TProps> = ({ noticeUuid }: TProps) => {
  const router = useRouter();
  const { data } = useGetNoticeDetail(noticeUuid);
  return (
    <div className="w-full flex-1 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={'공지사항'}
      />
      <div className="mt-3 pb-5">
        <div className="flex items-center justify-between">
          <span className="font-xs-2 text-sand-08">
            {data?.data.category.name}
          </span>

          <p className="font-xs-2 text-gray-05">
            {dayjs(data?.data.createdAt).format('YYYY-MM-DD')}
          </p>
        </div>
        <p className="font-m-1 mt-0.5 line-clamp-2 text-gray-08">
          {data?.data.title}
        </p>
      </div>
      <p className="mt-7">{data?.data.content}</p>
    </div>
  );
};
