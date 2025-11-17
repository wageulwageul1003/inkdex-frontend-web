import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export const Collection = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex w-full items-center justify-center gap-1"
        >
          <Icons.plus className="size-6 fill-gray-06" />
          <span className="font-m-2">컬렉션에 담기</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>담고싶은 컬렉션을 선택해주세요</DrawerTitle>
        </DrawerHeader>

        <div className="mt-7 px-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-01 py-2 pl-3 pr-4">
            <div className="flex items-center gap-3">
              <Icons.plus className="size-6 fill-gray-06" />
              <span className="font-s-2 text-gray-09">새 컬렉션 만들기</span>
            </div>
            <Icons.keyboardArrowRight className="size-6 fill-gray-06" />
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild></DrawerClose>
          <Button>담기</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
