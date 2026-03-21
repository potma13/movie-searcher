'use client';

import { Tabs } from 'antd';

interface AppTabsProps {
  searchContent: React.ReactNode;
}

export function AppTabs({ searchContent }: AppTabsProps) {
  const items = [
    {
      key: '1',
      label: 'Search',
      children: searchContent,
    },
    {
      key: '2',
      label: 'Rated',
      children: <div style={{ textAlign: 'center' }}>Rated movies</div>,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      centered
      size="large"
      items={items}
      style={{ marginBottom: 24 }}
    />
  );
}
