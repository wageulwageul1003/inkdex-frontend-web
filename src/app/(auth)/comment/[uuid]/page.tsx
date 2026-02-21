import CommentView from '@/components/views/(protected)/comment';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <CommentView uuid={uuid} />;
}
