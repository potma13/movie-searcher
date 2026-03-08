'use client';

import { Card, Rate, Typography, Tag } from 'antd';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { truncateText } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Text } = Typography;

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl =
    movie.poster_path && !movie.isMock
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '/poster.jpg';

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'd MMMM yyyy', { locale: ru })
    : 'Дата неизвестна';

  const placeholderGenres = ['боевик', 'драма', 'комедия'];

  return (
    <Card className="movie-card">
      <div className="movie-card-wrapper">
        <div className="poster-wrapper">
          <Image
            src={posterUrl}
            alt={movie.title}
            width={150}
            height={225}
            className="poster-image"
          />
        </div>

        <div className="movie-content">
          <Typography.Title level={4} className="movie-title">
            {movie.title}
          </Typography.Title>

          <div className="movie-score">{movie.vote_average.toFixed(1)}</div>

          <Text className="movie-date">{releaseDate}</Text>

          <div className="movie-genres">
            {placeholderGenres.map((genre, index) => (
              <Tag key={index}>{genre}</Tag>
            ))}
          </div>

          <Typography.Paragraph className="movie-description">
            {truncateText(movie.overview || 'Описание отсутствует', 75)}
          </Typography.Paragraph>

          <div className="movie-rating">
            <Rate disabled count={10} value={movie.vote_average} />
          </div>
        </div>
      </div>
    </Card>
  );
}
