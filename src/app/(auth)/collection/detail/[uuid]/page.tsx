import { CollectionDetailView } from '@/components/views/(public)/my-inkdex/_components/collection/collection-detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <CollectionDetailView uuid={uuid} />;
}
