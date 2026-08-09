import { NoData } from '@/components/shared/NoData';

export const NoResult = () => {
  return (
    <NoData
      message={
        <span className="flex justify-center">
          검색 결과가 없어요. <br />
          검색어의 철자가 정확한지 확인해주세요.
        </span>
      }
    />
  );
};
