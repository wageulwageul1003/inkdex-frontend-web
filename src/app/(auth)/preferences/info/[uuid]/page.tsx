import InfoDetailComponent from '@/components/views/(protected)/preferences/info/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <InfoDetailComponent uuid={uuid} />;
}
