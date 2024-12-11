'use client';

import { signOut, useSession } from 'next-auth/react';
import useSWR, { Fetcher } from 'swr';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';

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
  const clearUserSettings = useUserSettingsStore(
    (state) => state.clearUserSettings,
  );

  const silentlySignOut = () => {
    signOut({ redirect: false });
    clearUserSettings();
  };

  if (isLoading) return null;
  if (!res) {
    silentlySignOut();
    return null;
  }
  if (!res.ok && res.status === 401) {
    silentlySignOut();
  }

  if (error) silentlySignOut();

  return null;
}
