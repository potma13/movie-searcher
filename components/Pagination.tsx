'use client';

import { Pagination } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  total: number;
}

export function PaginationControls({
  currentPage,
  total,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={6}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
}
