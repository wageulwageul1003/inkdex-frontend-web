import TermDetailView from '@/components/views/(protected)/preferences/term/detail';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <TermDetailView uuid={uuid} />;
}
