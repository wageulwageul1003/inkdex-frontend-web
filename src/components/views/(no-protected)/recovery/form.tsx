'use client';

import { ReactNode } from 'react';

interface RecoveryFormProps {
  children: ReactNode;
  item: string;
}

const RecoveryForm = ({ children, item }: RecoveryFormProps) => {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full">
        <div className="flex flex-col items-start text-left">
          <p className="font-subtitle-bold">{item} 찾기</p>
        </div>
        <p className="font-caption mt-2 flex flex-col items-start text-gray-400">
          가입 정보를 확인할 수 없는 경우 고객센터로 문의 주세요.
        </p>

        <div className="mt-8 flex flex-col items-start">{children}</div>
      </div>
    </div>
  );
};

export default RecoveryForm;
