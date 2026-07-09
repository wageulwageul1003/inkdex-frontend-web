import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useDeleteFollow } from '@/hooks/follow/useDeleteFollow';

interface TProps {
  uuid: string;
  isShowFollowingCancel: boolean;
  setIsShowFollowingCancel: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

export const FollowingCancel = ({
  uuid,
  setIsShowFollowingCancel,
  onSuccess,
}: TProps) => {
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFollowingCancel = async () => {
    await deleteFollow(uuid);
    setIsShowFollowingCancel(false);
    onSuccess();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsShowFollowingCancel(true)}
          className="w-full"
        >
          <span className="font-m-2 text-black">팔로잉</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mb-3 mt-7 px-4">
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className="flex h-14 w-full items-center gap-3 border-none bg-gray-01 py-2 pl-3 pr-4"
              onClick={handleFollowingCancel}
            >
              <Icons.userCancel className="size-6 fill-red-06" />
              <span className="font-m-2 text-red-06">팔로우 취소하기</span>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
