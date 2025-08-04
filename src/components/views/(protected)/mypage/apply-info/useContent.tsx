import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // pagination
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // Initialize tab from URL
  const [constProgramType, setConstProgramType] = useState<string>(
    searchParams.get('constProgramType') || 'whole',
  );

  // Update URL with parameters
  const updateURL = (options: {
    constProgramType?: string;
    page?: string;
    pageSize?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page to 1 if changing search, month, year or tab
    if (options.constProgramType !== undefined) {
      params.set('page', '1');
      // params.set('pageSize', '10');
    }

    // Handle tab
    if (options.constProgramType !== undefined) {
      if (options.constProgramType) {
        params.set('constProgramType', options.constProgramType);
      } else {
        params.delete('constProgramType');
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
    setConstProgramType(value);
    updateURL({ constProgramType: value });
  };

  // Handle page change
  const onChangePage = (newPage: number) => {
    updateURL({ page: newPage.toString() });
    // Scroll up
    window.scrollTo(0, 0);
  };

  // Update tab when URL changes
  useEffect(() => {
    const urlConstProgramType = searchParams.get('constProgramType');

    // Update tab if changed
    if (urlConstProgramType && urlConstProgramType !== constProgramType) {
      setConstProgramType(urlConstProgramType);
    }
  }, [constProgramType, searchParams]);

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
    constProgramType,
    onChangeTab,
    page,
    pageSize,
    onChangePage,
  };
};
