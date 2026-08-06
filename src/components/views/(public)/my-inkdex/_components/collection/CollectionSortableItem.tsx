import { Icons } from '@/components/shared/icons';
import { VISIBILITY_ENUM } from '@/constants/enum';
import { ICollectionResponse } from '@/hooks/collection/useGetCollectionAllList';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

type Props = {
  item: ICollectionResponse;
};

export function CollectionSortableItem({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.uuid,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 py-3"
    >
      <button {...attributes} {...listeners}>
        <Icons.gripVertical className="size-5 text-gray-04" />
      </button>

      <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-gray-02">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <span className="font-m-2 text-gray-09">{item.name}</span>

      {item.visibility === VISIBILITY_ENUM.FOLLOWERS && (
        <span className="rounded-full bg-gray-01 p-1">
          <Icons.worldMap className="size-4 fill-gray-06" />
        </span>
      )}

      {item.visibility === VISIBILITY_ENUM.PRIVATE && (
        <span className="rounded-full bg-gray-01 p-1">
          <Icons.lock className="size-4 fill-gray-06" />
        </span>
      )}
    </div>
  );
}
