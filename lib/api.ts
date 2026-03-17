import { MovieResponse } from '@/types/movie';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_URL;

export async function searchMovies(
  query: string = 'return',
  page: number = 1
): Promise<MovieResponse> {
  if (!API_KEY || !BASE_URL) {
    throw new Error('TMDB API не настроен');
  }

  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}&language=ru-RU`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
