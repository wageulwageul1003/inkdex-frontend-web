'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { ACCESS_TOKEN, USER_ID } from '@/constants/tokens';
import { useGetAccountInfo } from '@/hooks/auth/useGetAccountInfo';
import { usePostLogout } from '@/hooks/auth/usePostLogout';
import { cn } from '@/lib/utils';

export const AccountComponent = () => {
  const router = useRouter();
  const { mutateAsync: postLogout } = usePostLogout();
  const { data: accountInfo } = useGetAccountInfo();
  const [logoutAlertOpen, setLogoutAlertOpen] = React.useState(false);

  const LoginMethod = [
    {
      title: '카카오',
      iconSrc: '/thrid-party-logo/Kakao.png',
      bgColor: 'bg-[#FEE500]',
      access: true,
    },
    {
      title: 'Apple',
      iconSrc: '/thrid-party-logo/Apple.png',
      bgColor: 'bg-black',
      access: false,
    },
    {
      title: '구글',
      iconSrc: '/thrid-party-logo/Google.png',
      bgColor: 'bg-white',
      access: true,
    },
  ];

  const handleLogout = () => {
    try {
      postLogout();
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(USER_ID);
      router.push('/login');
    } catch (error) {
      console.log(error);
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
          sdfnkdsf@naver.com
        </span>

        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <span className="font-xs-2 text-gray-06">
            SNS 계정을 연동하여 간편하게 로그인할 수 있습니다.
          </span>
          <div className="flex items-center gap-4">
            {LoginMethod.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    item.access ? item.bgColor : 'bg-gray-3',
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
                    item.access ? 'text-gray-08' : 'text-gray-05',
                    'font-xs-2',
                  )}
                >
                  {item.access ? '연결 완료' : '연결하기'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-12 flex items-center justify-between border-b border-gray-01 py-2`}
        >
          <p className="font-m-2 text-gray-09">비밀번호 설정</p>
          <Button
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={() => router.push('/preferences/account/set-password')}
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
            <p className="font-m-2 text-gray-09">회원탈퇴</p>
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
