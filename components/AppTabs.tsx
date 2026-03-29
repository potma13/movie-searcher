'use client';

import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Tabs, Tooltip } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useThemeMode } from './ThemeProvider';

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
  const { mode, toggleTheme } = useThemeMode();

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
      tabBarExtraContent={{
        right: (
          <Tooltip
            title={mode === 'dark' ? 'Светлая тема' : 'Темная тема'}
            placement="left"
          >
            <Button
              aria-label="Переключить тему"
              type="text"
              className="theme-toggle"
              onClick={toggleTheme}
              icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            />
          </Tooltip>
        ),
      }}
    />
  );
}
