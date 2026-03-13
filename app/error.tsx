'use client';

import { Alert, Button } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <Alert
        message="Ошибка загрузки фильмов"
        description={error.message}
        type="error"
        showIcon
        action={<Button onClick={() => reset()}>Попробовать снова</Button>}
      />
    </div>
  );
}
