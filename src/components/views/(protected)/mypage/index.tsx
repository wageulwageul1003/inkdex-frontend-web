'use client';

import { useRouter } from 'next/navigation';

import { Notification } from '@/components/shared/Notification';
import { Header } from '@/components/shared/layout/header';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { MyProfile } from './_components/MyProfile';

const menus = [
  {
    title: '계정',
    path: '/preferences/account',
    icon: <Icons.user className="size-5 fill-gray-06" />,
  },
  {
    title: '알림설정',
    path: '/preferences/push-setting',
    icon: <Icons.bell className="size-5 fill-gray-06" />,
  },
  {
    title: '공지사항',
    path: '/preferences/notice',
    icon: <Icons.speakerphone className="size-5 fill-gray-06" />,
  },
  {
    title: '문의하기',
    path: '/preferences/faq',
    icon: <Icons.question className="size-5 fill-gray-06" />,
  },
  {
    title: '의견보내기',
    path: '/preferences/feedback',
    icon: <Icons.mail className="size-5 fill-gray-06" />,
  },
  {
    title: '정보',
    path: '/preferences/info',
    icon: <Icons.infoFill className="size-5 fill-gray-06" />,
  },
];

export const MyPageView = () => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={<span className="font-l-1 text-black">마이페이지</span>}
        right={
          <span className="flex items-center gap-2">
            <Notification />
          </span>
        }
      />

      <MyProfile />

      <div className="mt-4 flex flex-1 flex-col">
        {menus.map((menu, index) => (
          <div
            key={menu.title}
            className={`flex items-center justify-between border-b border-gray-01 py-2 ${
              index === menus.length - 1 ? 'border-b-0' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {menu.icon}
              <p className="font-m-1 text-gray-09">{menu.title}</p>
            </div>
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => router.push(menu.path)}
            >
              <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
