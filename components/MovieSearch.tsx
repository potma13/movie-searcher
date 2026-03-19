'use client';

import { useEffect, useState, useMemo } from 'react';
import { Input, Pagination, Spin, Empty, Alert } from 'antd';
import debounce from 'lodash/debounce';
import { Movie } from '@/types/movie';
import { searchMovies } from '@/lib/api';
import { MovieList } from './MovieList';

export function MovieSearch() {
  const [query, setQuery] = useState('Гарри Поттер');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMovies = async (searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(searchQuery);
      setMovies(data.results || []);
      setTotal(data.total_results || 0);
    } catch (err: unknown) {
      setMovies([]);
      if (err instanceof Error) setError(err.message);
      else setError('Произошла ошибка при загрузке фильмов');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setQuery(value);
        fetchMovies(value);
      }, 500),
    []
  );

  useEffect(() => {
    fetchMovies(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moviesToShow = movies.slice((page - 1) * 6, page * 6);

  return (
    <>
      <Input
        placeholder="Type to search..."
        size="large"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" description="Загрузка фильмов..." />
        </div>
      ) : error ? (
        <div style={{ maxWidth: 250 }}>
          <Alert type="error" title={error} showIcon />
        </div>
      ) : moviesToShow.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty description="Фильмы не найдены" />
        </div>
      ) : (
        <>
          <MovieList movies={moviesToShow} />

          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}
          >
            <Pagination
              current={page}
              total={movies.length}
              pageSize={6}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </>
  );
}
