'use client';

import { Card, Rate, Typography, Tag, Empty, message } from 'antd';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { truncateText } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useGenres } from './GenreProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface MovieCardProps {
  movie: Movie;
  guestSessionId: string;
}

function getRatingColor(value: number) {
  if (value <= 3) {
    return '#E90000';
  }

  if (value <= 5) {
    return '#E97E00';
  }

  if (value <= 7) {
    return '#E9D100';
  }

  return '#66E900';
}

export function MovieCard({ movie, guestSessionId }: MovieCardProps) {
  const hasPoster = movie.poster_path;
  const genres = useGenres();
  const router = useRouter();
  const [userRating, setUserRating] = useState<number>(movie.rating ?? 0);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    setUserRating(movie.rating ?? 0);
  }, [movie.rating]);

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'd MMMM yyyy', { locale: ru })
    : 'Дата неизвестна';

  const ratingValue = userRating || movie.vote_average;

  const movieGenres =
    movie.genre_ids
      ?.map((genreId) => genres[genreId])
      .filter((genre): genre is string => Boolean(genre)) || [];

  return (
    <Card className="movie-card">
      <div className="movie-card-wrapper">
        <div className="poster-wrapper">
          {hasPoster ? (
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={150}
              height={260}
              className="poster-image"
            />
          ) : (
            <div className="poster-fallback">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Нет постера"
                style={{ margin: 0 }}
              />
            </div>
          )}
        </div>

        <div className="movie-content">
          <Typography.Title level={4} className="movie-title">
            {movie.title}
          </Typography.Title>

          <div
            className="movie-score"
            style={{ borderColor: getRatingColor(ratingValue) }}
          >
            {ratingValue.toFixed(1)}
          </div>

          <Text className="movie-date">{releaseDate}</Text>

          <div className="movie-genres">
            {movieGenres.length ? (
              movieGenres
                .slice(0, 3)
                .map((genre) => <Tag key={genre}>{genre}</Tag>)
            ) : (
              <Tag>Жанр неизвестен</Tag>
            )}
          </div>

          <Typography.Paragraph className="movie-description">
            {truncateText(movie.overview || 'Описание отсутствует', 180)}
          </Typography.Paragraph>

          <div className="movie-rating">
            <Rate
              allowHalf
              count={10}
              value={userRating}
              disabled={isRating}
              onChange={async (value) => {
                setIsRating(true);

                const shouldClear = value === 0 || value === userRating;
                const nextValue = shouldClear ? 0 : value;

                try {
                  const response = await fetch('/api/rating', {
                    method: shouldClear ? 'DELETE' : 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      movieId: movie.id,
                      guestSessionId,
                      value: nextValue,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Не удалось сохранить оценку');
                  }

                  setUserRating(nextValue);
                  router.refresh();
                } catch {
                  message.error('Не удалось сохранить оценку');
                } finally {
                  setIsRating(false);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
