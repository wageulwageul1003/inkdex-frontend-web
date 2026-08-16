'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface HeaderProps {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const Header = ({ title, left, right, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-12 items-center justify-between bg-white',
        className,
      )}
    >
      <div className="absolute z-10">{left}</div>
      <h1 className="absolute left-0 right-0 mx-auto w-fit">{title}</h1>
      <div className="absolute right-0 z-10">{right}</div>
    </header>
  );
};
