'use client';

import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';

import CButton from '@/components/shared/CButton';
import { Icons } from '@/components/shared/icons';

const RegisterSuccessView: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="default-login-layout-content">
      <div className="flex flex-col items-center justify-center gap-2 py-[52px]">
        <Icons.check_circle_fill className="h-l w-l fill-black" />
        <p className="font-subtitle-bold">회원가입 완료</p>
        <div className="flex flex-col items-center">
          <p className="font-caption text-gray-400">
            지금 바로 로그인하고 다양한 서비스를 경험해 보세요.
          </p>
        </div>
      </div>

      <CButton
        buttonType="contained"
        text="로그인 바로가기"
        type="submit"
        className={`$bg-gray-700 mt-[80px] w-full rounded px-4 py-2 text-white`}
        onClick={() => router.push(`/login`)}
      />
    </div>
  );
};

export default RegisterSuccessView;
