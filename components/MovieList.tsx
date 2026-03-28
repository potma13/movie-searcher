'use client';

import { Row, Col } from 'antd';
import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  guestSessionId: string;
}

export function MovieList({ movies, guestSessionId }: MovieListProps) {
  return (
    <Row gutter={[24, 24]}>
      {movies.map((movie) => (
        <Col key={movie.id} xs={24} md={12}>
          <MovieCard movie={movie} guestSessionId={guestSessionId} />
        </Col>
      ))}
    </Row>
  );
}
