'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetTermsDetail } from '@/hook/terms/useGetTermsDetail';

interface TProps {
  uuid: string;
}

export const Terms: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const { data: termsContent } = useGetTermsDetail(uuid);
  return (
    <div className="flex w-full flex-col">
      <Header
        title={<span>약관 동의</span>}
        right={
          <Icons.close
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
      />
      <h1>{termsContent?.content}</h1>
    </div>
  );
};
