import { NextResponse } from 'next/server';
import { deleteMovieRating, rateMovie } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const { movieId, guestSessionId, value } = await req.json();

    if (!movieId || !guestSessionId || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Некорректные параметры' },
        { status: 400 }
      );
    }

    await rateMovie(movieId, guestSessionId, value);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось сохранить оценку';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { movieId, guestSessionId } = await req.json();

    if (!movieId || !guestSessionId) {
      return NextResponse.json(
        { error: 'Некорректные параметры' },
        { status: 400 }
      );
    }

    await deleteMovieRating(movieId, guestSessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось удалить оценку';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
