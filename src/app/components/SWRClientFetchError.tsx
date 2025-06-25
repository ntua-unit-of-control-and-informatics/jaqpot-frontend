'use client';

import { JaqpotCustomError } from '@/app/types/jaqpot-custom-error';

interface ClientFetchErrorProps {
  error: JaqpotCustomError;
  className?: string;
}

export default function SWRClientFetchError(props: ClientFetchErrorProps) {
  return (
    <div {...props}>
      Failed to load <p>{props.error?.message}</p>
    </div>
  );
}
