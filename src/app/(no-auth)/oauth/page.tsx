'use client';

import { Loading } from '@/components/shared/Loading';
import { ACCESS_TOKEN, USER_EMAIL, USER_UUID } from '@/constants/tokens';
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
    const email = searchParams.get('email');

    if (!accessToken || !uuid || !email) {
      toast.error('로그인에 실패했습니다.');
      router.replace('/email-login');

      return;
    }

    Cookies.set(ACCESS_TOKEN, accessToken);
    Cookies.set(USER_UUID, uuid);
    Cookies.set(USER_EMAIL, email);

    router.replace('/');
  }, [router, searchParams]);

  return <Loading />;
}
