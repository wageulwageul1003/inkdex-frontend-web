import { BottomMenu } from '@/components/shared/bottom-menu';

export default function MenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
      <BottomMenu />
    </div>
  );
}
