import { unstable_cache } from 'next/cache';
import { MovieResponse } from '@/types/movie';

const DEFAULT_QUERY = 'Гарри Поттер';

const fetchMovies = unstable_cache(
  async (query: string, page: number): Promise<MovieResponse> => {
    const API_KEY = process.env.TMDB_API_KEY;
    const BASE_URL = process.env.TMDB_API_URL;

    if (!API_KEY || !BASE_URL) {
      throw new Error('TMDB API не настроен');
    }

    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=ru-RU`
    );

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }

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
