import OtherProfileComponent from '@/components/views/(protected)/other-profile';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <OtherProfileComponent uuid={uuid} />;
}
