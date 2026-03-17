'use client';

import { Tabs } from 'antd';
import { MovieSearch } from './MovieSearch';

export function AppTabs() {
  const items = [
    {
      key: '1',
      label: 'Search',
      children: <MovieSearch />,
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
