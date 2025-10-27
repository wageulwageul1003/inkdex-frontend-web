import { PostsDetail } from '@/components/views/(protected)/posts/detail';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <PostsDetail uuid={uuid} />;
}
