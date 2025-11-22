import { Icons } from './icons';

import { cn } from '@/lib/utils';

interface Props {
  status: boolean;
}

export const Alaram = ({ status }: Props) => {
  return (
    <div className="relative h-7 w-7 shrink-0">
      <Icons.bell className={cn('size-6 fill-gray-06')} />
      {status && (
        <span className="absolute right-0 top-0 h-1 w-1 rounded-full bg-red-05"></span>
      )}
    </div>
  );
};
