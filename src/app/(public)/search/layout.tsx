export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="default-layout-content flex flex-1">{children}</div>;
}
