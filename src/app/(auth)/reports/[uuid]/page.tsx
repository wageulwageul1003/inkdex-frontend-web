import { ReportsDetail } from '@/components/views/(protected)/reports/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <ReportsDetail uuid={uuid} />;
}
