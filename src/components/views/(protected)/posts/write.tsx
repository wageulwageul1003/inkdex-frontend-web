'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';

interface TProps {
  uuid: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <Header
        left={
          <Icons.close
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
        title={<span>글쓰기</span>}
        right={<Icons.pencil className="size-6 fill-black" />}
      />
    </div>
  );
};
