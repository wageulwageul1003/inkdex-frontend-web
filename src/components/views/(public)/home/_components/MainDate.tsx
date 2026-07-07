import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

interface IMainDate {
  selectedYear: string;
  selectedMonth: string | null;
  total: number;
}

const MainDate = ({ selectedYear, selectedMonth, total }: IMainDate) => {
  const displayDate = () => {
    if (selectedMonth) {
      return `${selectedYear}년 ${selectedMonth}월의 기록`;
    }

    return `${selectedYear}년의 기록`;
  };

  return (
    <span className="mt-5 flex items-center justify-between">
      <span className="font-m-1 text-gray-06">
        <p>{displayDate()}</p>
        <p>
          <span className="text-sand-09">{total.toLocaleString()}</span>
          개의 글이 쌓였어요
        </p>
      </span>

      <Button className="flex h-7 w-7 items-center justify-center rounded-full border-none bg-white p-0">
        <Icons.keyboardArrowDown className="size-5 shrink-0 fill-sand-08" />
      </Button>
    </span>
  );
};

export default MainDate;
