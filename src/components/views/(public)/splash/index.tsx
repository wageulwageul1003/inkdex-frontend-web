'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { PERMISSION_SHOWN } from '@/constants/tokens';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Cookies.get(PERMISSION_SHOWN)) {
        router.push('/login');
      } else {
        router.push('/permission');
      }
    }); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-gray-01">
      <Image
        src={'/logos/inkdex-logo.png'}
        alt="Logo"
        width={100}
        height={100}
        className="aspect-[2/1] w-full"
      />
      <span className="font-xs-1 text-center text-gray-05">
        당신의 잉크가 우리의 인덱스가 되다.
      </span>
    </div>
  );
}
