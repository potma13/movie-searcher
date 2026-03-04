import { MovieResponse } from '@/types/movie';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_URL;

export async function searchMovies(
  query: string = 'return'
): Promise<MovieResponse> {
  if (!API_KEY || !BASE_URL) {
    console.log('API ключ или URL не настроены, пропускаем запрос');
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`
    );

    if (!response.ok) {
      console.error(`API ответил с ошибкой: ${response.status}`);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе к TMDB API:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
