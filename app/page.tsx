import { Alert, Empty } from 'antd';
import { AppTabs } from '@/components/AppTabs';
import { MovieList } from '@/components/MovieList';
import { MovieSearch } from '@/components/MovieSearch';
import { PaginationControls } from '@/components/Pagination';
import { searchMovies } from '@/lib/api';
import { MovieResponse } from '@/types/movie';

const DEFAULT_QUERY = 'Гарри Поттер';
const UI_PAGE_SIZE = 6;

interface HomePageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const queryParam = resolvedSearchParams.query;
  const query = queryParam === undefined ? DEFAULT_QUERY : queryParam.trim();
  const currentPage = Math.max(Number(resolvedSearchParams.page) || 1, 1);

  let data: MovieResponse | null = null;
  let errorMessage: string | null = null;

  if (query) {
    try {
      data = await searchMovies(query);
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при загрузке фильмов';
    }
  }

  const allMovies = data?.results || [];
  const movies = allMovies.slice(
    (currentPage - 1) * UI_PAGE_SIZE,
    currentPage * UI_PAGE_SIZE
  );
  const total = allMovies.length;

  const searchContent = (
    <>
      <MovieSearch initialQuery={query} />

      {errorMessage ? (
        <div style={{ maxWidth: 130 }}>
          <Alert type="error" title={errorMessage} showIcon />
        </div>
      ) : movies.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty description="Фильмы не найдены" />
        </div>
      ) : (
        <div className="movies-wrapper">
          <MovieList movies={movies} />
          <PaginationControls currentPage={currentPage} total={total} />
        </div>
      )}
    </>
  );

  return (
    <main className="container">
      <AppTabs searchContent={searchContent} />
    </main>
  );
}
