import { Menu } from '@/components/shared/layout/menu';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <Menu />
    </div>
  );
}
