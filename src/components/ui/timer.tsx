'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { Icons } from '../shared/icons';

import { cn } from '@/lib/utils';

type TProps = {
  expire: string | number;
};

const Timer = ({ expire }: TProps) => {
  const [timer, setTimer] = useState<string | null>(null);

  useEffect(() => {
    const end = new Date(expire);
    const updateTimer = () => {
      const diff = end.getTime() - new Date().getTime();
      const formattedTime = format(diff, 'mm:ss');
      setTimer(formattedTime);
      if (diff <= 0) {
        clearInterval(self);
        setTimer('00:00');
      }
    };

    // Set an interval to update the timer every second
    const self = setInterval(updateTimer, 1000);

    // Run the updateTimer function immediately to avoid 1s delay
    updateTimer();

    return () => {
      clearInterval(self);
    };
  }, [expire]);

  return (
    <span
      className={cn('flex items-center justify-center gap-0.5 text-gray-05')}
    >
      <Icons.schedule className="size-5 fill-gray-04" />
      <span className="font-xs-2 text-gray-04">
        {timer !== null ? timer : '00:00'}
      </span>
    </span>
  );
};

export default Timer;
