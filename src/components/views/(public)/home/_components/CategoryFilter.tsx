import { Icons } from '@/components/shared/icons';

export const categoryItems = [
  {
    value: 'all',
    label: '전체',
    status: 'add',
  },
  {
    value: 'photo',
    label: '사진',
    status: 'remove',
  },
  {
    value: 'video',
    label: '동영상',
    status: 'remove',
  },
];

export const CategoryItemComponent = ({
  value,
  label,
  status,
}: {
  value: string;
  label: string;
  status: string;
}) => {
  return (
    <div className="flex items-center justify-center justify-between rounded-[16px] border border-gray-300 p-4">
      <span>{label}</span>
      {status === 'add' ? (
        <Icons.categoryAdd className="size-6 fill-black stroke-white" />
      ) : (
        <Icons.categoryRemove className="size-6 fill-gray-200 stroke-black" />
      )}
    </div>
  );
};

export const CategoryFilter = () => {
  return (
    <div className="mb-5 mt-6 grid grid-cols-2 gap-2">
      {categoryItems.map((item) => (
        <CategoryItemComponent key={item.value} {...item} />
      ))}
    </div>
  );
};
