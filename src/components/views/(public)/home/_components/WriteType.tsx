import { Icons } from '@/components/shared/icons';

const wirteTypeItems = [
  {
    value: 'photo',
    label: '카메라',
  },
  {
    value: 'video',
    label: '앨범',
  },
];

const WriteTypeItemComponent = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <div className="flex items-center justify-center justify-between rounded-[16px] border border-gray-300 p-4">
      <span>{label}</span>
      <Icons.keyboardArrowRight className="size-6" />
    </div>
  );
};

export const WriteType = () => {
  return (
    <div className="mb-5 mt-6 grid grid-cols-2 gap-2">
      {wirteTypeItems.map((item) => (
        <WriteTypeItemComponent key={item.value} {...item} />
      ))}
    </div>
  );
};
