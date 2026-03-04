import { searchMovies } from '@/lib/api';
import { MovieList } from '@/components/MovieList';

export default async function HomePage() {
  const data = await searchMovies('return');
  const movies = data.results || [];

  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <MovieList movies={movies} />
    </main>
  );
}
