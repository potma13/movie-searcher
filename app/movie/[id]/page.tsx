import { notFound } from 'next/navigation';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  if (!params.id) {
    notFound();
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Страница фильма {params.id}</h1>
      <p>Здесь будет информация о фильме</p>
    </div>
  );
}
