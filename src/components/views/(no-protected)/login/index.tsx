'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Login() {
  const router = useRouter();

  const LoginMethod = [
    {
      title: '카카오',
      iconSrc: '/thrid-party-logo/Kakao.png',
      bgColor: 'bg-[#FEE500]',
      color: 'text-gray-09',
    },
    {
      title: 'Apple',
      iconSrc: '/thrid-party-logo/Apple.png',
      bgColor: 'bg-black',
      color: 'text-white',
    },
    {
      title: '구글',
      iconSrc: '/thrid-party-logo/Google.png',
      bgColor: 'bg-white',
      color: 'text-black',
      border: 'border-gray-02',
    },
    {
      title: '이메일',
      icon: 'email',
      iconColor: 'fill-white',
      color: 'text-white',
      bgColor: 'bg-gray-08',
      onClick: () => {
        router.push('/email-login');
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.push('/home')}>
          <Icons.close className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mb-[60px] mt-14 flex items-center justify-center">
        <Image
          src="/logos/inkdex-logo-basic.png"
          alt="Logo"
          width={160}
          height={100}
          className="aspect-[35/16]"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full items-center gap-3 px-4">
          <div className="h-px flex-1 bg-gray-03" />
          <span className="font-xs-2 text-center text-gray-06">
            로그인/회원가입
          </span>
          <div className="h-px flex-1 bg-gray-03" />
        </div>
        <div className="flex w-full flex-1 flex-col items-center">
          <div className="mt-10 flex w-full flex-col gap-5">
            {LoginMethod.map((method) => (
              <div
                onClick={method.onClick}
                key={method.title}
                className={cn(
                  'relative flex w-full cursor-pointer items-center justify-center rounded-lg px-3.5 py-3.5',
                  method.bgColor,
                  method.border,
                )}
              >
                <div className="absolute left-3.5">
                  {method.icon ? (
                    React.createElement(
                      Icons[method.icon as keyof typeof Icons],
                      { className: cn('size-[18px]', method.iconColor) },
                    )
                  ) : method.iconSrc ? (
                    <Image
                      src={method.iconSrc}
                      alt={method.title}
                      width={18}
                      height={18}
                      className="size-[18px]"
                    />
                  ) : null}
                </div>
                <p className={cn(method.color, 'font-s-2')}>
                  {method.title}로 시작하기
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-3.5">
        <Button onClick={() => router.push('/home')} variant="icon" size="sm">
          로그인 없이 둘러보기
          <Icons.keyboardArrowRight className="size-4 fill-gray-06" />
        </Button>
      </div>
    </div>
  );
}
