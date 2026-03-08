import { searchMovies } from '@/lib/api';
import { MovieList } from '@/components/MovieList';

export default async function HomePage() {
  const data = await searchMovies('return');
  const movies = data.results || [];

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
      <main
        style={{
          padding: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          minHeight: '100vh',
        }}
      >
        <MovieList movies={movies} />
      </main>
    </div>
  );
}
