'use client';

import { CustomError } from '@/app/types/CustomError';

interface ClientFetchErrorProps {
  error: CustomError;
}

export default function ClientFetchError({ error }: ClientFetchErrorProps) {
  return (
    <div>
      Failed to load <p>{error?.message}</p>
    </div>
  );
}
