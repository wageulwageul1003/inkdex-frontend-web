import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import Loading from './loading';

import { cn } from '@/lib/utils';
import { AuthProvider } from '@/providers/auth';
import QueryProvider from '@/providers/query-provider';

import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  // Define the base URL for production and development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: 'inkdex',
    description: 'inkdex',
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: 'inkdex',
      description: 'inkdex',
      images: [
        {
          url: '/images/og-image.png',
          width: 1100,
          height: 700,
          alt: 'inkdex',
        },
      ],
      type: 'website',
    },
  };
}

export default async function IndexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  return (
    <html lang="ko" translate="no">
      <body className={cn('flex min-h-screen flex-col')}>
        <QueryProvider>
          <AuthProvider>
            <Suspense fallback={<Loading />}>
              <div className="default-layout-content flex flex-1">
                {children}
              </div>
            </Suspense>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
