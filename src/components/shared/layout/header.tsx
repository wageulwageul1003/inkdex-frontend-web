'use client';

import React from 'react';

interface HeaderProps {
  title: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Header = ({ title, left, right }: HeaderProps) => {
  return (
    <header className="relative flex h-14 items-center justify-between px-4">
      <div className="absolute left-4 z-10">{left}</div>
      <h1 className="absolute left-0 right-0 mx-auto w-fit">{title}</h1>
      <div className="absolute right-4 z-10">{right}</div>
    </header>
  );
};
