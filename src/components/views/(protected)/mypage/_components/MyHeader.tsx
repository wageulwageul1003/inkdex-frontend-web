'use client';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

interface MyHeaderProps {
  title: string;
  onClick?: () => void;
}

const MyHeader = ({ title, onClick }: MyHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-gray-09 text-m-1">{title}</span>
      <Button
        onClick={onClick}
        variant="buttonIconTextOnly"
        size="buttonIconMedium"
      >
        <Icons.keyboardArrowRight className="size-6" />
      </Button>
    </div>
  );
};

export default MyHeader;
