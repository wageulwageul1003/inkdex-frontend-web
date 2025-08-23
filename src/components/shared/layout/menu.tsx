'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Icons } from '../icons';

const menuItems = [
  {
    title: '메인',
    href: '/home',
    icon: <Icons.home className="size-6" />,
  },
  {
    title: '검색',
    href: '/search',
    icon: <Icons.search className="size-6" />,
  },
  {
    title: '북마크',
    href: '/bookmark',
    icon: <Icons.bookmark className="size-6" />,
  },
  {
    title: '마이페이지',
    href: '/mypage',
    icon: <Icons.user className="size-6" />,
  },
];

export const Menu = () => {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 flex items-center justify-between bg-white p-5">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.title}>
            {React.cloneElement(item.icon, {
              className: `size-6 ${isActive ? 'fill-black' : 'fill-gray-500'}`,
            })}
          </Link>
        );
      })}
    </div>
  );
};
