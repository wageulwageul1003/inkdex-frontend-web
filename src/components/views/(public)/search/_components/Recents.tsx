import { Icons } from '@/components/shared/icons';

export const recentItems = [
  {
    uuid: '1',
    keyword: '인덱스',
  },
  {
    uuid: '2',
    keyword: '인덱스',
  },
  {
    uuid: '3',
    keyword: '인덱스',
  },
];

export const Recents = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p>최근 검색어</p>
        <p>전체 삭제</p>
      </div>
      <div className="flex gap-2">
        {recentItems.map((item) => (
          <div
            key={item.uuid}
            className="flex items-center gap-1 rounded-[16px] border border-gray-300 px-3 py-2"
          >
            <p>{item.keyword}</p>
            <Icons.close className="size-3 fill-black" />
          </div>
        ))}
      </div>
    </div>
  );
};
