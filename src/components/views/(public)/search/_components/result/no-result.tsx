import { Icons } from '@/components/shared/icons';

export const NoResult = () => {
  return (
    <div className="mt-14 flex flex-col">
      <Icons.moodEmpty className="size-8 fill-gray-03" />
      <h3 className="font-s-2 mt-[6px] text-gray-05">
        검색 결과가 없어요. <br />
        검색어의 철자가 정확한지 확인해주세요.
      </h3>
    </div>
  );
};
