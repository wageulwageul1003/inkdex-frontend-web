import { NoticeDetail } from '@/components/views/(protected)/preferences/notice/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <NoticeDetail noticeUuid={uuid} />;
}
