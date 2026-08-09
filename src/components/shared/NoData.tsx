import { ReactNode } from 'react';
import { Icons } from './icons';

interface INoData {
  message: string | ReactNode;
}

export const NoData = ({ message }: INoData) => {
  return (
    <div className="mt-14 flex flex-col items-center gap-[6px]">
      <Icons.moodEmpty className="size-8 fill-gray-03" />
      <span className="font-s-2 text-center text-gray-05">{message}</span>
    </div>
  );
};
