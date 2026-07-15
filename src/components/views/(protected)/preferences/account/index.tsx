'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { ACCESS_TOKEN, USER_UUID } from '@/constants/tokens';
import { cn } from '@/lib/utils';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';

export const AccountView = () => {
  const router = useRouter();
  const { data: myProfile } = useGetMyProfile();
  const [logoutAlertOpen, setLogoutAlertOpen] = React.useState(false);

  const LOGIN_METHODS = [
    {
      title: '카카오',
      provider: 'KAKAO',
      iconSrc: '/thrid-party-logo/Kakao.png',
      bgColor: 'bg-[#FEE500]',
    },
    {
      title: 'Apple',
      provider: 'APPLE',
      iconSrc: '/thrid-party-logo/Apple.png',
      bgColor: 'bg-black',
    },
    {
      title: '구글',
      provider: 'GOOGLE',
      iconSrc: '/thrid-party-logo/Google.png',
      bgColor: 'bg-white',
    },
  ];

  const handleMethodClick = (method: (typeof LOGIN_METHODS)[number]) => {
    const state = {
      uuid: Cookies.get(USER_UUID),
      mode: 'CONNECT',
    };
    if (method.title == '카카오') {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        response_type: 'code',
        state: JSON.stringify(state),
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

  const handleLogout = () => {
    try {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(USER_UUID);
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetPassword = () => {
    if (myProfile?.data.hasPassword) {
      router.push('/preferences/account/current-password');
    } else {
      router.push('/preferences/account/set-password');
    }
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">계정</span>}
      />
      <div className="mt-4 flex flex-1 flex-col">
        <span className="font-m-2 text-gray-1 flex h-10 items-center">
          {myProfile?.data.email}
        </span>

        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <span className="font-xs-2 text-gray-06">
            SNS 계정을 연동하여 간편하게 로그인할 수 있습니다.
          </span>
          <div className="flex items-center gap-4">
            {LOGIN_METHODS.map((item) => {
              const connected =
                myProfile?.data.provider?.includes(item.provider) ?? false;
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-2"
                  onClick={() => handleMethodClick(item)}
                >
                  <div
                    className={cn(
                      connected ? item.bgColor : 'bg-gray-3',
                      'flex h-11 w-11 items-center justify-center rounded-lg',
                    )}
                  >
                    <Image
                      src={item.iconSrc}
                      alt={item.title}
                      width={18}
                      height={18}
                      className="size-[18px]"
                    />
                  </div>
                  <span
                    className={cn(
                      connected ? 'text-gray-08' : 'text-gray-05',
                      'font-xs-2',
                    )}
                  >
                    {connected ? '연결 완료' : '연결하기'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-12 flex items-center justify-between border-b border-gray-01 py-2`}
        >
          <p className="font-m-2 text-gray-09">비밀번호 설정</p>
          <Button
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={handleSetPassword}
          >
            <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
          </Button>
        </div>

        <div className="mt-12">
          <div
            className={`flex items-center justify-between border-b border-gray-01 py-2`}
          >
            <p className="font-m-2 text-gray-09">로그아웃</p>
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => setLogoutAlertOpen(true)}
            >
              <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
            </Button>
          </div>
          <div
            className={`flex items-center justify-between border-b border-gray-01 py-2`}
          >
            <p className="font-m-2 text-gray-09">회원 탈퇴</p>
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => router.push('/preferences/account/delete')}
            >
              <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
            </Button>
          </div>
        </div>
      </div>

      <CustomAlertDialog
        isOpen={logoutAlertOpen}
        onOpenChange={setLogoutAlertOpen}
        title="로그아웃 하시겠습니까?"
        cancelText="아니오"
        confirmText="예"
        onConfirm={() => handleLogout()}
        type="warning"
      ></CustomAlertDialog>
    </div>
  );
};
