'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '../../ui/button';
import { Icons } from '../icons';

export const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: '/home', icon: Icons.home },
    { href: '/search', icon: Icons.compass },
    { href: '/my-inkdex', icon: Icons.archive },
    { href: '/my', icon: Icons.user },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-end justify-between gap-0.5 bg-white px-4 pb-4 pt-2">
      {menuItems.slice(0, 2).map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-w-[64px] flex-col items-center"
          >
            <div className="flex items-center justify-center">
              <IconComponent
                className={`size-7 ${active ? 'fill-gray-10' : 'fill-gray-04'}`}
              />
            </div>
          </Link>
        );
      })}

      <div className="relative -top-4 flex min-w-[64px] justify-center">
        <Button
          size="buttonIconLarge"
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
            <div className="flex items-center justify-center">
              <IconComponent
                className={`size-7 ${active ? 'fill-gray-10' : 'fill-gray-04'}`}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
