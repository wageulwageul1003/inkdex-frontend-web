'use client';

import { useRouter } from 'next/navigation';

import Menu from './_components/Menu';
import PwdCheckDialog from './_components/PwdDialog';
import ApplyInfo from './apply-info/ApplyInfo';

import CTextButton from '@/components/shared/CTextButton';
import { Icons } from '@/components/shared/icons';
import { useGetMyInfo } from '@/hooks/auth/mypage/useGetMyInfo';

export const MypageView = () => {
  const { data: myInfo } = useGetMyInfo();
  const router = useRouter();

  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        <Menu />
        <div className="flex w-full flex-col gap-8 lg:flex-col">
          <div className="flex items-center justify-between rounded border border-gray-200 px-6 py-9 shadow-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="font-subtitle-bold text-gray-700">
                  {myInfo?.nickName}
                </span>
                <span className="font-body2-bold text-gray-500">님</span>
              </div>
              <div className="font-body1 flex items-center gap-2 text-gray-500">
                <span>{myInfo?.name}</span>
                <div className="h-3 w-[1px] bg-gray-200"></div>
                <span>{myInfo?.email}</span>
              </div>
            </div>

            <PwdCheckDialog />
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center justify-between py-3">
              <h2 className="font-body2-bold text-gray-700">
                프로그램 신청 내역
              </h2>
              <CTextButton
                text="더보기"
                iconPosition="right"
                icon={
                  <Icons.keyboard_arrow_right className="h-xs w-xs fill-gray-500" />
                }
                onClick={() => router.push('/mypage/programs-history')}
              />
            </div>
            <ApplyInfo type="mypage" />
          </div>
        </div>
      </div>
    </div>
  );
};
