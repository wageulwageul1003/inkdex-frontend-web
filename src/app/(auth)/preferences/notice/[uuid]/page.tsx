import NoticeDetailView from '@/components/views/(protected)/preferences/notice/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <NoticeDetailView noticeUuid={uuid} />;
}
