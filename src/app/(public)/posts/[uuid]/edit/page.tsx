import { PostsWrite } from '@/components/views/(protected)/posts/write';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <PostsWrite uuid={uuid} />;
}
