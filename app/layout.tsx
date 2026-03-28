import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { GenreProvider } from '@/components/GenreProvider';
import { getGenres } from '@/lib/api';
import { Genre } from '@/types/movie';
import 'antd/dist/reset.css';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Movie Search App',
  description: 'Приложение для поиска фильмов',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let genres: Genre[] = [];

  try {
    const response = await getGenres();
    genres = response.genres;
  } catch {
    genres = [];
  }

  return (
    <html lang="ru">
      <body>
        <ConfigProvider locale={ruRU}>
          <GenreProvider genres={genres}>{children}</GenreProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
