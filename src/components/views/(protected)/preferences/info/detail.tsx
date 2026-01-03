'use client';

import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetTermsDetail } from '@/hooks/terms/useGetTermsDetail';

interface TProps {
  uuid: string;
}

const InfoDetailComponent: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const { data } = useGetTermsDetail(uuid);

  return (
    <div className="w-full bg-white px-4">
      <Header
        title={<span className="font-m-1 text-black">{data?.title}</span>}
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
      />
      <div className="font-m-2 mt-4 text-gray-09">{data?.content}</div>
    </div>
  );
};

export default InfoDetailComponent;
