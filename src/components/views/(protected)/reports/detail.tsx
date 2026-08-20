'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/Header';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';

interface TProps {
  uuid: string;
}

const message = [
  '신고가 접수되어 운영 정책에 따라 해당 기록이 서비스에서 노출되지 않습니다.',
  '운영 정책에 따라 검토 후 해당 기록의 제한 상태가 변경될 수 있습니다.',
  '이용이 제한된 게시물은 나의 인덱스에서도 해당 기록을 확인할 수 없습니다.',
];

export const ReportsDetail: FC<TProps> = ({ uuid }: TProps) => {
  const router = useRouter();
  const { data } = useGetPostDetail(uuid);

  return (
    <div className="w-full flex-1 bg-gray-01 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={<span className="font-m-1 text-black">기록 이용 제한</span>}
      />

      <div className="mt-10 flex flex-col">
        <span className="font-l-1 text-black">
          해당 기록이 이용 제한 되었습니다.
        </span>
        <span className="font-xs-2 text-gray-05">조치 일시 : 2025-11-23</span>

        <div className="mt-4 space-y-2 rounded-md bg-white px-1 py-3">
          {message.map((msg) => (
            <span className="font-xs-2 flex text-gray-05">
              <Icons.ellipse className="size-4 fill-gray-05" />
              {msg}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-7 border-t border-gray-02"></div>
    </div>
  );
};
