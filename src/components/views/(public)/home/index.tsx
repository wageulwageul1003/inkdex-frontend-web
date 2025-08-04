'use client';

import { Card } from './_components/Card';

import Chips from '@/components/shared/chips';

export const categoryItems = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'photo',
    label: '사진',
  },
  {
    value: 'video',
    label: '동영상',
  },
];

export const Home = () => {
  return (
    <div className="py-4">
      <Chips items={categoryItems} variant="multiple" />

      <div className="mt-4">
        <Card nickname="nickname" viewCounting={1} nicknameSrc="" src="" />
      </div>
    </div>
  );
};
