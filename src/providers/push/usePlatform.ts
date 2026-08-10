'use client';

import { useEffect, useState } from 'react';

export type Platform = 'IOS' | 'ANDROID' | 'WEB';

interface UsePlatformReturn {
  platform: Platform;
  isLoading: boolean;
}

function detectPlatform(): Platform {
  const userAgent = window.navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'IOS';
  }

  if (/Android/i.test(userAgent)) {
    return 'ANDROID';
  }

  return 'WEB';
}

export function usePlatform(): UsePlatformReturn {
  const [platform, setPlatform] = useState<Platform>('WEB');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsLoading(false);
  }, []);

  return {
    platform,
    isLoading,
  };
}
