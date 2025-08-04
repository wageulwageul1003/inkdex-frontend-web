'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Cookies.get('permission-shown')) {
        router.push('/login');
      } else {
        router.push('/permission');
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src={'/logos/logo.png'}
        alt="Logo"
        width={100}
        height={100}
        className="aspect-[4/1] w-full"
      />
    </div>
  );
}
