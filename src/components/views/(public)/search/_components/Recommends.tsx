import Chips from '@/components/shared/chips';

export const recommendItems = [
  {
    value: '1',
    label: '인덱스',
  },
  {
    value: '2',
    label: '인덱스',
  },
  {
    value: '3',
    label: '인덱스',
  },
];

export const Recommends = () => {
  return (
    <div className="flex flex-col gap-4">
      <p>추천 검색어</p>
      <div>
        <Chips items={recommendItems} />
      </div>
    </div>
  );
};
