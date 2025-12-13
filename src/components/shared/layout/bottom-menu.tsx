'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '../../ui/button';
import { Icons } from '../icons';

export const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: '/home', icon: Icons.home, label: '피드' },
    { href: '/search', icon: Icons.search, label: '검색' },
    { href: '/wishlist', icon: Icons.note, label: '나의 인덱스' },
    { href: '/my', icon: Icons.user, label: 'MY' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-0 left-4 right-4 flex items-end justify-between gap-0.5 bg-white pb-4 pt-2">
      {menuItems.slice(0, 2).map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-w-[64px] flex-col items-center"
          >
            <IconComponent
              className={`size-6 ${active ? 'fill-gray-10' : 'fill-gray-04'}`}
            />
            <span
              className={`font-xs-2 ${active ? 'text-gray-10' : 'text-gray-04'}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <div className="relative -top-4 flex min-w-[64px] justify-center">
        <Button
          size="buttonIconMedium"
          variant="contained"
          className="shadow-2"
          onClick={() => {
            router.push('/posts/write');
          }}
        >
          <Icons.plus className="size-6 fill-white" />
        </Button>
      </div>

      {menuItems.slice(2).map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-w-[64px] flex-col items-center"
          >
            <IconComponent
              className={`size-6 ${active ? 'fill-gray-10' : 'fill-gray-04'}`}
            />
            <span
              className={`font-xs-2 ${active ? 'text-gray-10' : 'text-gray-04'}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
