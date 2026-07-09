import { redirect } from 'next/navigation';

export default async function MyPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return redirect(`/my/${uuid}/collection`);
}
