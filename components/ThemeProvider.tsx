'use client';

import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => undefined,
});

const GUEST_STORAGE_KEY = 'guestSessionId';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getGuestCookieValue() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('guestSessionId='))
    ?.split('=')[1];
}

function setGuestCookieValue(guestSessionId: string) {
  document.cookie = `guestSessionId=${guestSessionId};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isCreatingSessionRef = useRef(false);

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

  useEffect(() => {
    const syncGuestSession = async () => {
      const storedSessionId = window.localStorage.getItem(GUEST_STORAGE_KEY);
      const cookieSessionId = getGuestCookieValue();

      if (storedSessionId) {
        if (cookieSessionId !== storedSessionId) {
          setGuestCookieValue(storedSessionId);
          router.refresh();
        }

        return;
      }

      if (isCreatingSessionRef.current) {
        return;
      }

      isCreatingSessionRef.current = true;

      try {
        const response = await fetch('/api/session', { cache: 'no-store' });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!data.guestSessionId) {
          return;
        }

        window.localStorage.setItem(GUEST_STORAGE_KEY, data.guestSessionId);

        if (cookieSessionId !== data.guestSessionId) {
          setGuestCookieValue(data.guestSessionId);
          router.refresh();
        }
      } finally {
        isCreatingSessionRef.current = false;
      }
    };

    void syncGuestSession();
  }, [router]);

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
