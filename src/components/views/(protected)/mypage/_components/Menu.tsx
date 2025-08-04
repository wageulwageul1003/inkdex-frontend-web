import Link from 'next/link';
import React from 'react';

import SignOut from './SignOut';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

// 메뉴 아이템 타입 정의
interface MenuItem {
  mainName: string;
  children: {
    subName: string;
    url: string;
  }[];
}

const Menu = () => {
  const items: MenuItem[] = [
    {
      mainName: '나의 프로그램',
      children: [
        {
          subName: '프로그램 신청 내역',
          url: '/mypage/programs-history',
        },
        {
          subName: '결제 내역',
          url: '/mypage/payments-history',
        },
      ],
    },
    {
      mainName: '나의 관심',
      children: [
        {
          subName: '도서',
          url: '/mypage/favorite-book',
        },
        {
          subName: '프로그램',
          url: '/mypage/favorite-program',
        },
      ],
    },
    {
      mainName: '나의 후기',
      children: [
        {
          subName: '작성한 후기',
          url: '/mypage/my-reviews',
        },
        {
          subName: '임시 보관함',
          url: '/mypage/my-temp-reviews',
        },
      ],
    },
    {
      mainName: '씨앗 포인트',
      children: [
        {
          subName: '포인트 이용안내',
          url: '/point-guides',
        },
        {
          subName: '나의 씨앗 현황',
          url: '/mypage/my-points',
        },
      ],
    },
    {
      mainName: '고객센터',
      children: [
        {
          subName: '공지사항',
          url: '/csr?tab=notice',
        },
        {
          subName: 'FAQ',
          url: '/csr?tab=faq',
        },
        {
          subName: '1:1 문의',
          url: '/csr?tab=inquiry',
        },
      ],
    },
  ];

  return (
    <div className="w-full lg:max-w-[342px]">
      {items.map((item, index) => (
        <div key={index} className="w-full">
          <div
            className={cn(
              'font-body2-bold border-b border-gray-200 py-3 text-gray-700',
            )}
          >
            <span>{item.mainName}</span>
          </div>

          {item.children.map((child, childIndex) => (
            <Link
              href={child.url}
              key={childIndex}
              className="font-body2 flex items-center justify-between px-2 py-3 text-gray-500"
            >
              <span>{child.subName}</span>
              <Icons.keyboard_arrow_right className="h-m w-m text-gray-500" />
            </Link>
          ))}
        </div>
      ))}
      <SignOut />
    </div>
  );
};

export default Menu;
