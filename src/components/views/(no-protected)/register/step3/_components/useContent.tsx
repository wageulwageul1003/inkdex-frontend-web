import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  searchKeyword: string;
};

export const useContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // pagination
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // Initialize form
  const form = useForm<FormValues>({
    defaultValues: {
      searchKeyword: searchParams.get('searchKeyword') || '',
    },
  });

  // Initialize tab from URL
  const [tab, setTab] = useState<string>(searchParams.get('tab') || 'whole');

  // Update URL with parameters
  const updateURL = (options: {
    searchKeyword?: string;
    tab?: string;
    page?: string;
    pageSize?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page to 1 if changing search, month, year or tab
    if (options.searchKeyword !== undefined || options.tab !== undefined) {
      params.set('page', '1');
      params.set('pageSize', '10');
    }

    // Handle searchKeyword
    if (options.searchKeyword !== undefined) {
      if (options.searchKeyword) {
        params.set('searchKeyword', options.searchKeyword);
      } else {
        params.delete('searchKeyword');
      }
    }

    // Handle tab
    if (options.tab !== undefined) {
      if (options.tab) {
        params.set('tab', options.tab);
        // 탭을 누를 때 필터 항목들 전부 삭제 됨
        params.delete('lectureFilter');
        params.delete('lectureFilterItem');
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

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (values.searchKeyword) {
      // If search keyword exists, navigate to search page with only the keyword
      const searchParams = new URLSearchParams();
      searchParams.set('searchKeyword', values.searchKeyword);
    }
    // Scroll up
    window.scrollTo(0, 0);
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

  // Update form and tab when URL changes
  useEffect(() => {
    const searchKeyword = searchParams.get('searchKeyword');
    const urlTab = searchParams.get('tab');

    // Update form if searchKeyword changed
    if (searchKeyword !== form.getValues('searchKeyword')) {
      form.setValue('searchKeyword', searchKeyword || '');
    }

    // Update tab if changed
    if (urlTab && urlTab !== tab) {
      setTab(urlTab);
    }
  }, [searchParams, form, tab]);

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
    form,
    onSubmit,
    tab,
    onChangeTab,
    page,
    pageSize,
    onChangePage,
  };
};
