'use client';

import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface AppTabsProps {
  searchContent: React.ReactNode;
  ratedContent: React.ReactNode;
  activeTab: 'search' | 'rated';
}

export function AppTabs({
  searchContent,
  ratedContent,
  activeTab,
}: AppTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const items = [
    {
      key: 'search',
      label: 'Search',
      children: searchContent,
    },
    {
      key: 'rated',
      label: 'Rated',
      children: ratedContent,
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', key);
        params.set('page', '1');

        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }}
      centered
      size="large"
      items={items}
      style={{ marginBottom: 24 }}
    />
  );
}
