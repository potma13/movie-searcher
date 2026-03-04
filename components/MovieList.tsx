'use client';

import { Row, Col } from 'antd';
import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: Movie[];
}

export function MovieList({ movies }: MovieListProps) {
  return (
    <Row gutter={[16, 16]} justify="center">
      {movies.map((movie) => (
        <Col key={movie.id}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
}
