'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { cn } from '@/lib/utils';

const LOGIN_METHODS = [
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
    title: 'Google',
    iconSrc: '/thrid-party-logo/Google.png',
    bgColor: 'bg-white',
    color: 'text-black',
    border: 'border border-gray-02',
  },
  {
    title: '이메일',
    icon: 'email',
    iconColor: 'fill-white',
    color: 'text-white',
    bgColor: 'bg-gray-08',
  },
] as const;

export default function Login() {
  const router = useRouter();

  const handleMethodClick = (method: (typeof LOGIN_METHODS)[number]) => {
    if (method.title == '카카오') {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        response_type: 'code',
      });

      location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
    }
    if (method.title === 'Google') {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
      });

      location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    if (method.title === 'Apple') {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
        response_type: 'code',
        response_mode: 'form_post',
        scope: 'name email',
      });

      location.href = `https://appleid.apple.com/auth/authorize?${params}`;
    }

    if (method.title === '이메일') {
      router.push('/email-login');
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <Header className="bg-gray-01" />

      <div className="mt-[58px] flex justify-center">
        <Image
          src="/logos/inkdex-logo-basic.png"
          alt="inkdex"
          width={140}
          height={64}
          className="h-16 w-[140px] object-contain"
          priority
        />
      </div>

      <div className="mt-[60px] flex flex-col">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-03" />
          <span className="font-xs-2 shrink-0 text-gray-06">
            로그인/회원가입
          </span>
          <div className="h-px flex-1 bg-gray-03" />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          {LOGIN_METHODS.map((method) => (
            <button
              type="button"
              key={method.title}
              onClick={() => handleMethodClick(method)}
              className={cn(
                'relative flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-3.5',
                method.bgColor,
                'border' in method ? method.border : undefined,
              )}
            >
              <div className="absolute left-3.5">
                {'icon' in method && method.icon ? (
                  React.createElement(
                    Icons[method.icon as keyof typeof Icons],
                    { className: cn('size-[18px]', method.iconColor) },
                  )
                ) : 'iconSrc' in method && method.iconSrc ? (
                  <Image
                    src={method.iconSrc}
                    alt=""
                    width={18}
                    height={18}
                    className="size-[18px]"
                  />
                ) : null}
              </div>
              <span className={cn('font-s-2', method.color)}>
                {method.title}로 시작하기
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
