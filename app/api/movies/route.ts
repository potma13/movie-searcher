import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/api';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || 'Гарри Поттер';
  const page = Number(searchParams.get('page') || '1');

  try {
    const data = await searchMovies(query, page);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить фильмы';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
