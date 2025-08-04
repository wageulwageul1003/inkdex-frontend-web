'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Splash from '@/components/views/(public)/splash';

const Home = (): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/permission');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return <Splash />;
};

export default Home;
