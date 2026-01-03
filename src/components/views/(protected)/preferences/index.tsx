'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';

const menus = [
  {
    title: 'FAQ',
    path: '/preferences/faq',
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
    path: '/preferences/inquiry',
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

export const PreferencesComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">설정</span>}
      />
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
            <Button variant="buttonIconTextOnly" size="buttonIconMedium">
              <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
