import { NextResponse } from 'next/server';
import { createGuestSession } from '@/lib/api';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(req: Request) {
  const requestCookies = req.headers.get('cookie') || '';
  const currentSessionId = requestCookies
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('guestSessionId='))
    ?.split('=')[1];

  if (currentSessionId) {
    return NextResponse.json({ guestSessionId: currentSessionId });
  }

  try {
    const guestSessionId = await createGuestSession();
    const response = NextResponse.json({ guestSessionId });

    response.cookies.set('guestSessionId', guestSessionId, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось создать сессию';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
