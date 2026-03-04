import { Card, Rate, Typography } from 'antd';
import Image from 'next/image';
import { Movie } from '@/types/movie';

const { Text } = Typography;

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('ru-RU')
    : 'Дата неизвестна';

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Image
          src={posterUrl}
          alt={movie.title}
          width={150}
          height={220}
          style={{ objectFit: 'cover' }}
        />

        <div style={{ flex: 1 }}>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            {movie.title}
          </Typography.Title>

          <Text type="secondary">{releaseDate}</Text>

          <div style={{ margin: '8px 0' }} />

          <Rate disabled defaultValue={movie.vote_average / 2} />

          <Typography.Paragraph style={{ marginTop: 8 }}>
            {movie.overview || 'Описание отсутствует'}
          </Typography.Paragraph>
        </div>
      </div>
    </Card>
  );
}
