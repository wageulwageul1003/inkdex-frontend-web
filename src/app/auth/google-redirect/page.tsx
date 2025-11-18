import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function GoogleRedirectPage() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email ?? '';
  const name = session?.user?.name ?? '';

  redirect(
    `/register/step4?email=${encodeURIComponent(email)}&name=${encodeURIComponent(
      name,
    )}`,
  );
}
