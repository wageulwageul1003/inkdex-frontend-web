'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';

const menus = [
  {
    title: '알림',
    subMenus: [
      {
        title: '푸시 알림',
        path: '/preferences/notifications/push',
      },
    ],
  },
  {
    title: '사용자',
    subMenus: [
      {
        title: '계정 정보 관리',
        path: '/preferences/user-setting',
      },
      {
        title: '신고 게시물',
        path: '/preferences/report',
      },
    ],
  },
  {
    title: '기타',
    subMenus: [
      {
        title: 'FAQ',
        path: '/preferences/faq',
      },
      {
        title: '공지사항',
        path: '/preferences/notice',
      },
      {
        title: '문의',
        path: '/preferences/inquiry',
      },
      {
        title: '약관 및 정책',
        path: '/preferences/inquiry',
      },
      {
        title: '앱 버전 정보',
        path: '/preferences/inquiry',
      },
      {
        title: '오픈 소스',
        path: '/preferences/inquiry',
      },
    ],
  },
];

export const PreferencesComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col">
      <Header
        title={<span>설정</span>}
        left={
          <Icons.keyboardArrowLeft
            onClick={() => router.back()}
            className="size-6 fill-black"
          />
        }
      />
      <div className="mt-5 flex flex-1 flex-col gap-6">
        {menus.map((menu) => (
          <div key={menu.title} className="border-b border-gray-300 pb-5">
            <p className="text-gray-500">{menu.title}</p>
            <div className="mt-4 flex flex-col gap-4">
              {menu.subMenus.map((subMenu) => (
                <Link
                  key={subMenu.title}
                  href={subMenu.path}
                  className="flex items-center justify-between text-black"
                >
                  <span>{subMenu.title}</span>
                  <Icons.keyboardArrowRight className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
