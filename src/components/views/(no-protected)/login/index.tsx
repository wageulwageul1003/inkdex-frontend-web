'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

const LoginMethod = [
  {
    title: '애플',
    icon: 'apple',
  },
  {
    title: '카카오',
    icon: 'kakao',
  },
  {
    title: '구글',
    icon: 'google',
  },
];

export default function Login() {
  const router = useRouter();
  const onClickConfirm = () => {};

  const onClickRegister = () => {
    router.push('/register/step1');
  };
  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="flex justify-end">
        <Button>둘러보기</Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-1 items-center">
          <Image
            src="/logos/logo.png"
            alt="Logo"
            width={160}
            height={100}
            className="aspect-[4/1]"
          />
        </div>
        <div className="flex w-full flex-1 flex-col items-center">
          <Button variant="cta" onClick={onClickConfirm} size="cta">
            이메일 로그인
          </Button>
          <div className="mt-10 flex gap-5">
            {LoginMethod.map((method) => (
              <div
                key={method.title}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  {Icons[method.icon as keyof typeof Icons] &&
                    React.createElement(
                      Icons[method.icon as keyof typeof Icons],
                      { className: 'size-5 fill-gray-700' },
                    )}
                </div>
                <div>
                  <p className="">{method.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="outline" onClick={onClickRegister}>
          이메일 회원가입
        </Button>
      </div>
    </div>
  );
}
