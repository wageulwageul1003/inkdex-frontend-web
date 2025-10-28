import { PostsDetail } from '@/components/views/(protected)/posts/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <PostsDetail uuid={uuid} />;
}
