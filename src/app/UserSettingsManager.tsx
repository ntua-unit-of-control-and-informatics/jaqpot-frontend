'use client';

import useSWR from 'swr';
import type { UserSettingsDto } from '@/app/api.types';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserSettingsManager() {
  const userSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );

  useSWR<UserSettingsDto>('/api/user/settings', fetcher, {
    onSuccess: (data) => {
      updateUserSettings(data, false);
    },
    revalidateOnFocus: false, // Since we're persisting to localStorage
    revalidateOnReconnect: false,
  });

  return null;
}
