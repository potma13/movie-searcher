import { unstable_cache } from 'next/cache';
import { GenreResponse, Movie, MovieResponse } from '@/types/movie';

const DEFAULT_QUERY = 'Гарри Поттер';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Ошибка API: ${status}`);
    this.status = status;
  }
}

function getApiConfig() {
  const apiKey = process.env.TMDB_API_KEY;
  const baseUrl = process.env.TMDB_API_URL;

  if (!apiKey || !baseUrl) {
    throw new Error('TMDB API не настроен');
  }

  return { apiKey, baseUrl };
}

async function ensureResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new ApiError(response.status, `Ошибка API: ${response.status}`);
  }

  return response;
}

// кэшируем результаты поиска на 60 секунд для оптимизации
const fetchMovies = unstable_cache(
  async (query: string, page: number): Promise<MovieResponse> => {
    const { apiKey, baseUrl } = getApiConfig();

    const response = await fetch(
      `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=ru-RU`
    );

    await ensureResponse(response);

    return response.json();
  },
  ['search-movies'],
  {
    revalidate: 60,
  }
);

export async function searchMovies(
  query: string = DEFAULT_QUERY,
  page: number = 1
): Promise<MovieResponse> {
  return fetchMovies(query, page);
}

export async function createGuestSession(): Promise<string> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/authentication/guest_session/new?api_key=${apiKey}`,
    { cache: 'no-store' }
  );

  await ensureResponse(response);

  const data = await response.json();
  return data.guest_session_id as string;
}

export async function getRatedMovies(
  guestSessionId: string,
  page: number = 1
): Promise<MovieResponse> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/guest_session/${guestSessionId}/rated/movies?api_key=${apiKey}&language=ru&page=${page}`,
    { cache: 'no-store' }
  );

  await ensureResponse(response);

  return response.json();
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=ru-RU`,
    { cache: 'no-store' }
  );

  await ensureResponse(response);

  return response.json();
}

export async function getGenres(): Promise<GenreResponse> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/genre/movie/list?api_key=${apiKey}&language=ru-RU`,
    { next: { revalidate: 86400 } }
  );

  await ensureResponse(response);

  return response.json();
}

export async function deleteMovieRating(
  movieId: number,
  guestSessionId: string
): Promise<void> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );

  await ensureResponse(response);
}

export async function rateMovie(
  movieId: number,
  guestSessionId: string,
  value: number
): Promise<void> {
  const { apiKey, baseUrl } = getApiConfig();

  const response = await fetch(
    `${baseUrl}/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
      cache: 'no-store',
    }
  );

  await ensureResponse(response);
}
