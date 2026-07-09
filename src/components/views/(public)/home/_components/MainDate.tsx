import { DatePickerBottomSheet } from './DatePickerBottomSheet';

interface IMainDate {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
  total: number;
}

const MainDate = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  total,
}: IMainDate) => {
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

      <DatePickerBottomSheet
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </span>
  );
};

export default MainDate;
