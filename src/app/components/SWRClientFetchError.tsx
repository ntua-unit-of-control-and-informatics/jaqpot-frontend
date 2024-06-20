'use client';

import { CustomError } from '@/app/types/CustomError';

interface ClientFetchErrorProps {
  error: CustomError;
  className?: string;
}

export default function SWRClientFetchError(props: ClientFetchErrorProps) {
  return (
    <div {...props}>
      Failed to load <p>{props.error?.message}</p>
    </div>
  );
}
