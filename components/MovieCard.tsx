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
    movie.poster_path && !movie.poster_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '/poster.jpg';

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'd MMMM yyyy', { locale: ru })
    : 'Дата неизвестна';

  const placeholderGenres = ['боевик', 'драма', 'комедия'];

  return (
    <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
      <div className="movie-card" style={{ display: 'flex' }}>
        <div className="poster-wrapper" style={{ flexShrink: 0, width: 150 }}>
          <Image
            src={posterUrl}
            alt={movie.title}
            width={150}
            height={220}
            className="poster-image"
            style={{
              objectFit: 'cover',
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        <div style={{ flex: 1, padding: '16px' }}>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            {movie.title}
          </Typography.Title>

          <Text type="secondary">{releaseDate}</Text>

          <div style={{ margin: '8px 0' }}>
            {placeholderGenres.map((genre, index) => (
              <Tag key={index} style={{ marginRight: 4 }}>
                {genre}
              </Tag>
            ))}
          </div>

          <Typography.Paragraph style={{ marginTop: 8 }}>
            {truncateText(movie.overview || 'Описание отсутствует', 120)}
          </Typography.Paragraph>

          <Rate disabled defaultValue={movie.vote_average / 2} />
        </div>
      </div>
    </Card>
  );
}
