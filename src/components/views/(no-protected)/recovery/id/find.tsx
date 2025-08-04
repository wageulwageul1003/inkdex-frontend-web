'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import CButton from '@/components/shared/CButton';

const RecoveryIdFindView: FC = () => {
  const id = useParams().id;
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[384px]">
        <div className="flex flex-col items-start text-left">
          <p className="font-subtitle-bold">아이디 찾기 완료</p>
        </div>
        <p className="font-caption mt-2 flex flex-col items-start text-gray-400">
          가입 정보를 확인해주세요.
        </p>

        <div className="mt-8 flex flex-col items-start gap-2 rounded bg-gray-100 px-4 py-8">
          <p className="font-body1 text-gray-700">가입 아이디</p>
          <p className="font-subtitle-bold text-gray-700">{id}</p>
        </div>

        <CButton
          buttonType="contained"
          text="로그인 바로가기"
          type="submit"
          className={`mt-[80px] w-full rounded bg-gray-700 px-4 py-2 text-white`}
          onClick={() => router.push('/login')}
        />
        <CButton
          buttonType="subtle"
          text="비밀번호 찾기"
          className={`mt-2 w-full rounded bg-white px-4 py-2 text-gray-500`}
          onClick={() => router.push('/recovery/password')}
        />
      </div>
    </div>
  );
};

export default RecoveryIdFindView;
