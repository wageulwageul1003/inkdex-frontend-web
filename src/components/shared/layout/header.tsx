'use client';

import React from 'react';

interface HeaderProps {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Header = ({ title, left, right }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center justify-between bg-white">
      <div className="absolute z-10">{left}</div>
      <h1 className="absolute left-0 right-0 mx-auto w-fit">{title}</h1>
      <div className="absolute right-0 z-10">{right}</div>
    </header>
  );
};
