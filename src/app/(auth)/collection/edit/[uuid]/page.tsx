import { CollectionWriteView } from '@/components/views/(protected)/collection/collection-write';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <CollectionWriteView uuid={uuid} />;
}
