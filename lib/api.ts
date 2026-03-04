import { MovieResponse } from '@/types/movie';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_URL;

// Тестовые данные (будут использоваться, если API недоступен)
const MOCK_MOVIES: MovieResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Начало (Inception)',
      overview: 'Профессиональный вор промышляет кражей идей из подсознания людей во время сна. Задания становятся всё сложнее, и грань между реальностью и сном стирается.',
      poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      genre_ids: [28, 878, 12]
    },
    {
      id: 2,
      title: 'Зелёная миля (The Green Mile)',
      overview: 'В тюрьме для смертников появляется заключённый с божественным даром. Он может исцелять людей и творить настоящие чудеса.',
      poster_path: '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
      release_date: '1999-12-10',
      vote_average: 8.5,
      genre_ids: [18, 14, 80]
    },
    {
      id: 3,
      title: 'Побег из Шоушенка (The Shawshank Redemption)',
      overview: 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме, он находит друзей и надежду там, где, кажется, её быть не может.',
      poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      release_date: '1994-09-23',
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 4,
      title: 'Крёстный отец (The Godfather)',
      overview: 'Криминальная сага об итальянской мафиозной семье Корлеоне. История власти, предательства и семейных уз.',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      release_date: '1972-03-24',
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 5,
      title: 'Властелин колец: Братство Кольца (The Lord of the Rings)',
      overview: 'Скромный хоббит Фродо получает в наследство могущественное кольцо, которое необходимо уничтожить. Для этого ему придётся отправиться в опасное путешествие.',
      poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      release_date: '2001-12-19',
      vote_average: 8.4,
      genre_ids: [12, 14, 28]
    }
  ],
  total_pages: 1,
  total_results: 5
};

export async function searchMovies(
  query: string = 'return'
): Promise<MovieResponse> {
  if (!API_KEY || !BASE_URL) {
    console.log('API ключ или URL не настроены, используем тестовые данные');
    return MOCK_MOVIES;
  }

  try {
    console.log('Пытаемся подключиться к TMDB API...');
    
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`
    );

    if (!response.ok) {
      console.error(`API ответил с ошибкой: ${response.status}`);
      console.log('Используем тестовые данные вместо API');
      return MOCK_MOVIES;
    }

    const data = await response.json();
    
    if (data.results.length === 0) {
      console.log('API вернул пустой результат, показываем тестовые фильмы');
      return MOCK_MOVIES;
    }
    
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к TMDB API:', error);
    console.log('Используем тестовые данные (API недоступен)');
    return MOCK_MOVIES;
  }
}
