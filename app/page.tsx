import { searchMovies } from '@/lib/api';
import { MovieList } from '@/components/MovieList';
import Title from 'antd/es/typography/Title';

export default async function HomePage() {
  const data = await searchMovies('return');
  const movies = data.results || [];

  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Поиск фильмов
      </Title>
      {movies.length > 0 ? (
        <MovieList movies={movies} />
      ) : (
        <p style={{ textAlign: 'center' }}>Фильмы не найдены</p>
      )}
    </main>
  );
}
