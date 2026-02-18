import { MyPageView } from '@/components/views/(protected)/mypage';

export default async function MyPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <MyPageView uuid={uuid} />;
}
