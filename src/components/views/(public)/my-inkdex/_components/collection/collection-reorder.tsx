'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { useGetCollectionAllList } from '@/hooks/collection/useGetCollectionAllList';
import { usePatchCollectionReorder } from '@/hooks/collection/usePatchCollectionReorder';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CollectionSortableItem } from './CollectionSortableItem';

export const CollectionReorderView = () => {
  const router = useRouter();
  const { data } = useGetCollectionAllList();
  const sensors = useSensors(useSensor(PointerSensor));

  const [collections, setCollections] = useState<
    NonNullable<typeof data>['data']
  >([]);

  useEffect(() => {
    if (data?.data) {
      setCollections(data.data);
    }
  }, [data]);

  const { mutateAsync: patchCollectionReorder } = usePatchCollectionReorder();

  const onSubmit = async () => {
    try {
      await patchCollectionReorder({
        collectionUuids: collections.map((item) => item.uuid),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setCollections((items) => {
      const oldIndex = items.findIndex((i) => i.uuid === active.id);
      const newIndex = items.findIndex((i) => i.uuid === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="w-full bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">목록 편집</span>}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={collections.map((item) => item.uuid)}
          strategy={verticalListSortingStrategy}
        >
          {collections.map((item) => (
            <CollectionSortableItem key={item.uuid} item={item} />
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="contained" size="lg" onClick={onSubmit}>
        저장
      </Button>
    </div>
  );
};
