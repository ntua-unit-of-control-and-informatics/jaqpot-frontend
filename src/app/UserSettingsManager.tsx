'use client';

import useSWR, { Fetcher } from 'swr';
import type { UserSettingsDto } from '@/app/api.types';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { ApiResponse } from '@/app/util/response';

const fetcher: Fetcher<ApiResponse<UserSettingsDto>> = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function UserSettingsManager() {
  const userSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );

  useSWR('/api/user/settings', fetcher, {
    onSuccess: ({ data }: ApiResponse<UserSettingsDto>) => {
      updateUserSettings({ ...data }, false);
    },
    revalidateOnFocus: false, // Since we're persisting to localStorage
    revalidateOnReconnect: false,
  });

  return null;
}
