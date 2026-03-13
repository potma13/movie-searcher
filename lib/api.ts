import { MovieResponse } from '@/types/movie';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_URL;

// тестовые данные (резервный вариант)
const MOCK_MOVIES: MovieResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Начало',
      overview:
        'Профессиональный вор промышляет кражей идей из подсознания людей во время сна. Задания становятся всё сложнее, и грань между реальностью и сном стирается.',
      poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      genre_ids: [28, 878, 12],
      isMock: true,
    },
    {
      id: 2,
      title: 'Зелёная миля',
      overview:
        'В тюрьме для смертников появляется заключённый с божественным даром. Он может исцелять людей и творить настоящие чудеса.',
      poster_path: '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
      release_date: '1999-12-10',
      vote_average: 8.5,
      genre_ids: [18, 14, 80],
      isMock: true,
    },
    {
      id: 3,
      title: 'Побег из Шоушенка',
      overview:
        'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме, он находит друзей и надежду там, где, кажется, её быть не может.',
      poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      release_date: '1994-09-23',
      vote_average: 8.7,
      genre_ids: [18, 80],
      isMock: true,
    },
    {
      id: 4,
      title: 'Крёстный отец',
      overview:
        'Криминальная сага об итальянской мафиозной семье Корлеоне. История власти, предательства и семейных уз.',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      release_date: '1972-03-24',
      vote_average: 8.7,
      genre_ids: [18, 80],
      isMock: true,
    },
    {
      id: 5,
      title: 'Крёстный отец',
      overview:
        'Криминальная сага об итальянской мафиозной семье Корлеоне. История власти, предательства и семейных уз.',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      release_date: '1972-03-24',
      vote_average: 8.7,
      genre_ids: [18, 80],
      isMock: true,
    },
    {
      id: 6,
      title: 'Властелин колец: Братство Кольца',
      overview:
        'Скромный хоббит Фродо получает в наследство могущественное кольцо, которое необходимо уничтожить. Для этого ему придётся отправиться в опасное путешествие. Скромный хоббит Фродо получает в наследство могущественное кольцо, которое необходимо уничтожить. Для этого ему придётся отправиться в опасное путешествие.',
      poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      release_date: '2001-12-19',
      vote_average: 8.4,
      genre_ids: [12, 14, 28],
      isMock: true,
    },
  ],
  total_pages: 1,
  total_results: 6,
};

export async function searchMovies(
  query: string = 'return'
): Promise<MovieResponse> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('DEV MODE: используем мок данные');
    return MOCK_MOVIES;
  }

  if (!API_KEY || !BASE_URL) {
    throw new Error('TMDB API не настроен');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('Фильмы не найдены');
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Не удалось загрузить фильмы');
  }
}
