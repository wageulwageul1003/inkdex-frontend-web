import { CollectionDetail } from '@/components/views/(public)/my-inkdex/_components/collection-detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <CollectionDetail uuid={uuid} />;
}
