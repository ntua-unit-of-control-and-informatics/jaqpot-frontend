'use client';

import { signOut, useSession } from 'next-auth/react';
import useSWR, { Fetcher } from 'swr';

const fetcher: Fetcher<Response, string> = async (url) => {
  return await fetch(url);
};

export default function SessionChecker() {
  const {
    data: res,
    isLoading,
    error,
  } = useSWR(`/api/auth/validate`, fetcher, {
    revalidateOnFocus: false, // Since we're persisting to localStorage
    revalidateOnReconnect: false,
  });

  if (isLoading) return null;
  if (!res) {
    signOut({ redirect: false });
    return null;
  }
  if (!res.ok && res.status === 401) {
    signOut({ redirect: false });
  }

  if (error) signOut({ redirect: false });

  return null;
}
