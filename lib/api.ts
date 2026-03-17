import { MovieResponse } from '@/types/movie';

export async function searchMovies(
  query: string = 'Гарри Поттер',
  page: number = 1
): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `/api/movies?query=${encodeURIComponent(query)}&page=${page}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Ошибка API: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results) {
      throw new Error('Фильмы не найдены');
    }

    return data;
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) return Promise.reject(err);
    return Promise.reject(new Error('Не удалось загрузить фильмы'));
  }
}
