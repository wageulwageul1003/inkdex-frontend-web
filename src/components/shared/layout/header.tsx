'use client';

interface HeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Header = ({ title, left, right }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      {left}
      <h1>{title}</h1>
      {right}
    </header>
  );
};
