'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { PERMISSION_SHOWN } from '@/constants/tokens';

export default function SplashView() {
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
        width={182}
        height={90}
      />
      <span className="font-xs-1 text-center text-gray-05">
        나의 필사가 쌓이는 곳, 잉덱스
      </span>
    </div>
  );
}
