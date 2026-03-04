import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import 'antd/dist/reset.css';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Movie Search App',
  description: 'Приложение для поиска фильмов',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ConfigProvider locale={ruRU}>{children}</ConfigProvider>
      </body>
    </html>
  );
}
