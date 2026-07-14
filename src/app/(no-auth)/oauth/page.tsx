'use client';

import { Loading } from '@/components/shared/Loading';
import { ACCESS_TOKEN, USER_UUID } from '@/constants/tokens';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function KakaoOAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const uuid = searchParams.get('uuid');

    if (!accessToken || !uuid) {
      toast.error('카카오 로그인에 실패했습니다.');
      router.replace('/email-login');

      return;
    }

    Cookies.set(ACCESS_TOKEN, accessToken);
    Cookies.set(USER_UUID, uuid);

    router.replace('/');
  }, [router, searchParams]);

  return <Loading />;
}
