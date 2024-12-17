'use client';

import { signOut, useSession } from 'next-auth/react';
import useSWR, { Fetcher } from 'swr';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { useCallback, useState } from 'react';

const fetcher: Fetcher<Response, string> = async (url) => {
  return await fetch(url);
};

/**
 * This component checks if the user's session is still valid on startup of the app.
 * There's no indication from the UI that this is happening, but if the session is invalid from the backend
 * we silently sign out the user.
 * @constructor
 */
export default function SessionChecker() {
  const clearUserSettings = useUserSettingsStore(
    (state) => state.clearUserSettings,
  );
  const [hasRun, setHasRun] = useState(false);

  const {
    data: res,
    isLoading,
    error,
  } = useSWR(`/api/auth/validate`, fetcher, {
    revalidateOnFocus: false, // Since we're persisting to localStorage
    revalidateOnReconnect: false,
  });

  const silentlySignOut = useCallback(async () => {
    await signOut({ redirect: false });
    clearUserSettings();
  }, []);

  if (hasRun) return null;

  if (isLoading) return null;
  if (!res) {
    silentlySignOut();
    return null;
  }
  if (!res.ok && res.status === 401) {
    silentlySignOut();
  }

  if (error) silentlySignOut();

  setHasRun(true);

  return null;
}
