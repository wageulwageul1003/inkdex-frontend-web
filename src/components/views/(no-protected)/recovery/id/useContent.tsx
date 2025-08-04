import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize tab from URL
  const [tab, setTab] = useState<string>(searchParams.get('tab') || 'phone');

  // Update URL with parameters
  const updateURL = (options: {
    searchKeyword?: string;
    tab?: string;
    page?: string;
    pageSize?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle tab
    if (options.tab !== undefined) {
      if (options.tab) {
        params.set('tab', options.tab);
      } else {
        params.delete('tab');
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

  // Update form and tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab');

    // Update tab if changed
    if (urlTab && urlTab !== tab) {
      setTab(urlTab);
    }
  }, [searchParams, tab]);

  return {
    tab,
    onChangeTab,
  };
};
