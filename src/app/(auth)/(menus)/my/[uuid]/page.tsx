import MyPageComponent from '@/components/views/(protected)/mypage';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <MyPageComponent uuid={uuid} />;
}
