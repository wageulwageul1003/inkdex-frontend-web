import { MyOtherPageView } from '@/components/views/(protected)/mypage/other';

export default async function MyPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <MyOtherPageView uuid={uuid} />;
}
