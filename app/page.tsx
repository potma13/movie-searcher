import { Alert, Empty } from 'antd';
import { cookies } from 'next/headers';
import { AppTabs } from '@/components/AppTabs';
import { MovieList } from '@/components/MovieList';
import { MovieSearch } from '@/components/MovieSearch';
import { PaginationControls } from '@/components/Pagination';
import {
  ApiError,
  getMovieDetails,
  getRatedMovies,
  searchMovies,
} from '@/lib/api';
import { Movie, MovieResponse } from '@/types/movie';

const DEFAULT_QUERY = 'Гарри Поттер';
const UI_PAGE_SIZE = 6;

interface HomePageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    tab?: string;
  }>;
}

function mergeRatings(movies: Movie[], ratedMovies: Movie[]) {
  // создаем карту для быстрого поиска рейтинга по id фильма
  const ratingById = new Map(
    ratedMovies.map((ratedMovie) => [ratedMovie.id, ratedMovie.rating])
  );

  return movies.map((movie) => ({
    ...movie,
    rating: ratingById.get(movie.id),
  }));
}

async function localizeRatedMovies(movies: Movie[]) {
  // загружаем русскоязычные данные для каждого оцененного фильма
  // т.к. api возвращает только на английском
  return Promise.all(
    movies.map(async (movie) => {
      try {
        const localizedMovie = await getMovieDetails(movie.id);

        return {
          ...movie,
          title: localizedMovie.title || movie.title,
          overview: localizedMovie.overview || movie.overview,
          release_date: localizedMovie.release_date || movie.release_date,
          poster_path: localizedMovie.poster_path ?? movie.poster_path,
          genre_ids: localizedMovie.genre_ids?.length
            ? localizedMovie.genre_ids
            : movie.genre_ids,
        };
      } catch {
        return movie;
      }
    })
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const queryParam = resolvedSearchParams.query;
  const query = queryParam === undefined ? DEFAULT_QUERY : queryParam.trim();
  const currentPage = Math.max(Number(resolvedSearchParams.page) || 1, 1);
  const activeTab = resolvedSearchParams.tab === 'rated' ? 'rated' : 'search';

  const guestSessionId = (await cookies()).get('guestSessionId')?.value || '';

  let searchData: MovieResponse | null = null;
  let ratedData: MovieResponse | null = null;
  let searchError: string | null = null;
  let ratedError: string | null = null;

  if (query) {
    try {
      searchData = await searchMovies(query);
    } catch (error) {
      searchError =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при загрузке фильмов';
    }
  }

  if (guestSessionId) {
    try {
      ratedData = await getRatedMovies(guestSessionId, 1);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        ratedData = {
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        };
      } else {
        ratedError =
          error instanceof Error
            ? error.message
            : 'Произошла ошибка при загрузке фильмов';
      }
    }
  }

  const ratedMoviesLocalized = await localizeRatedMovies(
    ratedData?.results || []
  );
  const searchMoviesWithRatings = mergeRatings(
    searchData?.results || [],
    ratedMoviesLocalized
  );

  const searchMoviesList = searchMoviesWithRatings.slice(
    (currentPage - 1) * UI_PAGE_SIZE,
    currentPage * UI_PAGE_SIZE
  );

  const ratedMoviesList = ratedMoviesLocalized.slice(
    (currentPage - 1) * UI_PAGE_SIZE,
    currentPage * UI_PAGE_SIZE
  );

  const searchContent = (
    <>
      <MovieSearch initialQuery={query} />

      {searchError ? (
        <div style={{ maxWidth: 130 }}>
          <Alert type="error" title={searchError} showIcon />
        </div>
      ) : searchMoviesList.length === 0 ? (
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
          <MovieList
            movies={searchMoviesList}
            guestSessionId={guestSessionId}
          />
          <PaginationControls
            currentPage={currentPage}
            total={searchMoviesWithRatings.length}
          />
        </div>
      )}
    </>
  );

  const ratedContent = ratedError ? (
    <div style={{ maxWidth: 130 }}>
      <Alert type="error" title={ratedError} showIcon />
    </div>
  ) : ratedMoviesList.length === 0 ? (
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
      <Empty description="Вы еще не оценили ни одного фильма" />
    </div>
  ) : (
    <div className="movies-wrapper">
      <MovieList movies={ratedMoviesList} guestSessionId={guestSessionId} />
      <PaginationControls
        currentPage={currentPage}
        total={ratedMoviesLocalized.length}
      />
    </div>
  );

  return (
    <main className="container">
      <AppTabs
        searchContent={searchContent}
        ratedContent={ratedContent}
        activeTab={activeTab}
      />
    </main>
  );
}
