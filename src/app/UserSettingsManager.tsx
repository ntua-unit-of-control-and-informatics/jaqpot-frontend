'use client';

import useSWR from 'swr';
import type { UserSettingsDto } from '@/app/api.types';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { useEffect } from 'react';
import { logger } from '@/logger';

const log = logger.child({ module: 'error' });

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserSettingsManager() {
  const userSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );

  const { data: settings } = useSWR<UserSettingsDto>(
    '/api/user/settings',
    fetcher,
    {
      onSuccess: (data) => {
        updateUserSettings(data);
      },
      revalidateOnFocus: false, // Since we're persisting to localStorage
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    fetch('/api/user/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSettings),
    }).catch((err) => log.error(err));
  }, [userSettings]);

  return null;
}
