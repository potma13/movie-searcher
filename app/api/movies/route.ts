import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || 'return';
  const page = searchParams.get('page') || '1';

  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = process.env.TMDB_API_URL;

  if (!API_KEY || !BASE_URL) {
    return NextResponse.json(
      { error: 'TMDB API не настроен' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=ru-RU`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Ошибка API: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error('Ошибка при fetch фильмов:', err);
    return NextResponse.json(
      { error: 'Не удалось загрузить фильмы' },
      { status: 500 }
    );
  }
}
