'use client';

import Card from 'antd/es/card';
import Rate from 'antd/es/rate';
import Text from 'antd/es/typography/Text';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { truncateText } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'd MMMM yyyy', { locale: ru })
    : 'Дата неизвестна';

  return (
    <Card
      hoverable
      cover={
        <Image
          alt={movie.title}
          src={posterUrl}
          width={240}
          height={300}
          style={{ objectFit: 'cover' }}
        />
      }
      style={{ width: 240, margin: '12px' }}
    >
      <Card.Meta
        title={movie.title}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text type="secondary">{releaseDate}</Text>
            <Rate disabled defaultValue={movie.vote_average / 2} allowHalf />
            <Text>
              {truncateText(movie.overview || 'Описание отсутствует', 100)}
            </Text>
          </div>
        }
      />
    </Card>
  );
}
