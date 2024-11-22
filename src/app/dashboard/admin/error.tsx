'use client';

import { useEffect } from 'react';
import CustomErrorPage from '@/app/components/CustomErrorPage';
import { logger } from '@/logger';

const log = logger.child({ module: 'error' });

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    log.error(error);
  }, [error]);

  return (
    <CustomErrorPage
      title="Something's wrong here 🚧"
      description={error.message}
    />
  );
}
