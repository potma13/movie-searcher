'use client';

import { createContext, useContext, useMemo } from 'react';
import { Genre } from '@/types/movie';

const GenreContext = createContext<Record<number, string>>({});

interface GenreProviderProps {
  genres: Genre[];
  children: React.ReactNode;
}

export function GenreProvider({ genres, children }: GenreProviderProps) {
  const genreMap = useMemo(
    () => Object.fromEntries(genres.map((genre) => [genre.id, genre.name])),
    [genres]
  );

  return (
    <GenreContext.Provider value={genreMap}>{children}</GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
}
