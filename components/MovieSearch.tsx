'use client';

import { Input } from 'antd';
import debounce from 'lodash/debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';

interface MovieSearchProps {
  initialQuery: string;
}

export function MovieSearch({ initialQuery }: MovieSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const updateSearchParams = useMemo(
    () =>
      debounce((nextQuery: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('query', nextQuery);
        params.set('page', '1');

        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }, 500),
    [pathname, router, searchParams]
  );

  useEffect(() => () => updateSearchParams.cancel(), [updateSearchParams]);

  return (
    <div className="search-input-wrapper">
      <Input
        placeholder="Type to search..."
        size="large"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          updateSearchParams(nextValue);
        }}
      />

      {isPending && (
        <div className="search-loading-overlay">
          <div className="loading-indicator">
            <span className="loading-spinner" />
            <span className="loading-text">Загрузка фильмов...</span>
          </div>
        </div>
      )}
    </div>
  );
}
