'use client';

import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem('theme-mode');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    window.localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm:
            mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
