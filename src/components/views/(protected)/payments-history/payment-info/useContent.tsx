import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // pagination
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // Initialize tab from URL
  const [tab, setTab] = useState<string>(searchParams.get('tab') || 'whole');

  // Update URL with parameters
  const updateURL = (options: {
    tab?: string;
    page?: string;
    pageSize?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page to 1 if changing search, month, year or tab
    if (options.tab !== undefined) {
      params.set('page', '1');
      // params.set('pageSize', '10');
    }

    // Handle tab
    if (options.tab !== undefined) {
      if (options.tab) {
        params.set('tab', options.tab);
      } else {
        params.delete('tab');
      }
    }

    // Handle page explicitly
    if (options.page !== undefined) {
      if (options.page) {
        params.set('page', options.page);
      } else {
        params.delete('page');
      }
    }

    // Handle pageSize explicitly
    if (options.pageSize !== undefined) {
      if (options.pageSize) {
        params.set('pageSize', options.pageSize);
      } else {
        params.delete('pageSize');
      }
    }

    // Update URL
    router.push(`?${params.toString()}`);
  };

  // Handle tab change
  const onChangeTab = (value: string) => {
    setTab(value);
    updateURL({ tab: value });
  };

  // Handle page change
  const onChangePage = (newPage: number) => {
    updateURL({ page: newPage.toString() });
    // Scroll up
    window.scrollTo(0, 0);
  };

  // Update tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab');

    // Update tab if changed
    if (urlTab && urlTab !== tab) {
      setTab(urlTab);
    }
  }, [tab, searchParams]);

  // Set default page parameter to 1 if not present
  useEffect(() => {
    const currentPage = searchParams.get('page');
    if (!currentPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    }
  }, []);

  return {
    tab,
    onChangeTab,
    page,
    pageSize,
    onChangePage,
  };
};
