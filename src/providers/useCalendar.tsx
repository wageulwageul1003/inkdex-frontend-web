import {
  addDays,
  addMonths,
  getDaysInMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import React from 'react';

const CALENDAR_CELL_LENGTH = 42;
const EMPTY_DAY = 0;
const DAY_OF_WEEK = 7;
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const useCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthStartDayIndex = monthStart.getDay();
  const totalMonthDays = getDaysInMonth(currentDate);

  const calendarStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1 - monthStartDayIndex,
  );

  const calendarDates = Array.from({ length: CALENDAR_CELL_LENGTH }).map(
    (_, i) => addDays(calendarStartDate, i),
  );

  const weekCalendarDates = calendarDates.reduce((acc: Date[][], cur, idx) => {
    const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(cur);
    return acc;
  }, []);

  const prevDayList = Array.from({ length: monthStartDayIndex }).map(
    () => EMPTY_DAY,
  );
  const currentDayList = Array.from({ length: totalMonthDays }).map(
    (_, i) => i + 1,
  );
  const nextDayList = Array.from({
    length: CALENDAR_CELL_LENGTH - currentDayList.length - prevDayList.length,
  }).map(() => EMPTY_DAY);

  const currentCalendarList = prevDayList.concat(currentDayList, nextDayList);
  const weekCalendarList = currentCalendarList.reduce(
    (acc: number[][], cur, idx) => {
      const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(cur);
      return acc;
    },
    [],
  );

  const goToPrevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const goToNextMonth = () => setCurrentDate((d) => addMonths(d, 1));

  return {
    dayLabels: DAY_LABELS,
    weekCalendarList,
    weekCalendarDates,
    calendarDates,
    currentDate,
    setCurrentDate,
    goToPrevMonth,
    goToNextMonth,
  };
};
export default useCalendar;
