import { useGetNotificationReadStatus } from '@/hooks/notification/useGetNotificationUnReadCount';
import { Icons } from './icons';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const Notification = () => {
  const router = useRouter();
  const { data: readStatus } = useGetNotificationReadStatus();

  return (
    <div
      className="relative h-7 w-7 shrink-0"
      onClick={() => router.push(`/notification`)}
    >
      <Icons.bell className={cn('size-6 fill-gray-06')} />
      {!readStatus?.data.isAllRead && (
        <span className="absolute right-0 top-0 h-1 w-1 rounded-full bg-red-05"></span>
      )}
    </div>
  );
};
