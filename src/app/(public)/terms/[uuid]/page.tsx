import { Terms } from '@/components/views/(public)/terms';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <Terms uuid={uuid} />;
}
