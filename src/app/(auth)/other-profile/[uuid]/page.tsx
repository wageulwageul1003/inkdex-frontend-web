import OtherProfileComponent from '@/components/views/(protected)/other-profile';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <OtherProfileComponent uuid={uuid} />;
}
