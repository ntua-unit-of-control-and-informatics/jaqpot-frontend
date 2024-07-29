'use client';

import { useEffect } from 'react';
import CustomErrorPage from '@/app/components/CustomErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <CustomErrorPage
      title="Something's wrong here 🚧"
      description={error.message}
    />
  );
}
