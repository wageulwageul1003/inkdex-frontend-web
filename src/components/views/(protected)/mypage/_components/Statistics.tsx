'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import Chips from '@/components/shared/chips';
import { Calendar } from '@/components/ui/calendar';

export const StatisticsComponent = () => {
  const [mode, setMode] = useState('weekely');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  console.log(date);

  return (
    <div>
      <Chips
        items={[
          { value: 'weekely', label: '주간' },
          { value: 'monthly', label: '월간' },
        ]}
        variant="single"
        onChange={(item) => setMode(item as string)}
      />
      <Calendar
        mode="range"
        className={`cnrounded-lg ${mode === 'monthly' ? 'hidden' : ''} border`}
        min={1}
        max={7}
        selected={date}
        onSelect={setDate}
      />
    </div>
  );

  return <div></div>;
};
