'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { useGetOtherProfile } from '@/hook/auth/other/useGetOtherProfile';

interface TProps {
  uuid: string;
}

const CommentComponent: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const { data } = useGetOtherProfile(uuid);

  return (
    <div className="w-full bg-white px-4">
      <h1>12321</h1>
    </div>
  );
};

export default CommentComponent;
