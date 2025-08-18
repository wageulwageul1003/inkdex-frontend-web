'use client';

import { Icons } from '@/components/shared/icons';

export const FieldState = ({
  text,
  isError,
}: {
  text: string;
  isError?: boolean;
}) => {
  return isError ? (
    <div className="flex items-center gap-2">
      <Icons.close className="size-4 fill-red-500" />
      <span className="text-red-500">{text}</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Icons.check className="size-4 fill-green-500" />
      <span className="text-green-500">{text}</span>
    </div>
  );
};
