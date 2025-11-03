'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { Toaster as Sonner, toast as sonnerToast } from 'sonner';

import { Icons } from '../shared/icons';

import { cn } from '@/lib/utils';

interface ToastProps {
  id: string | number;
  type?: 'success' | 'error' | 'default';
  title: string;
}

function Toast({ type = 'default', title }: ToastProps) {
  // ICONS
  let icon = null;
  switch (type) {
    case 'success':
      icon = (
        <Icons.checkCircleFill className="size-6 shrink-0 fill-green-05" />
      );
      break;
    case 'error':
      icon = (
        <Icons.emergencyHomeFill className="size-6 shrink-0 fill-yellow-04" />
      );
      break;
  }

  return (
    <div
      className={cn(
        'flex w-full min-w-[328px] items-center gap-2 rounded-lg bg-black/60 px-4 py-2 backdrop-blur-sm',
      )}
    >
      {icon}
      <p className="font-m-2 line-clamp-1 text-ellipsis text-left text-white">
        {title}
      </p>
    </div>
  );
}

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="min-w-[328px]"
      expand
      position="top-center"
      dir="auto"
      duration={2000}
      {...props}
    />
  );
};

export const toast = {
  custom: (props: Omit<ToastProps, 'id'>) =>
    sonnerToast.custom((id) => <Toast id={id} {...props} />),
  success: (title: string) =>
    sonnerToast.custom((id) => <Toast id={id} type="success" title={title} />),
  error: (title: string) =>
    sonnerToast.custom((id) => <Toast id={id} type="error" title={title} />),
  default: (title: string) =>
    sonnerToast.custom((id) => <Toast id={id} title={title} />),
};

export { Toaster };
