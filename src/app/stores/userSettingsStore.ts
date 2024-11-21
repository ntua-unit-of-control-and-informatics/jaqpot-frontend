import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension';
import { UserSettingsDto } from '@/app/api.types'; // required for devtools typing
import { logger } from '@/logger';

const log = logger.child({ module: 'error' });

interface UserSettingsState {
  userSettings: UserSettingsDto;
  updateUserSettings: (
    updatedSettings: Partial<UserSettingsDto>,
    persist?: boolean,
  ) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  devtools(
    persist(
      (set) => ({
        userSettings: {},
        updateUserSettings: (updatedSettings, persist = true) => {
          set((state) => ({
            userSettings: { ...state.userSettings, ...updatedSettings },
          }));

          if (persist) {
            fetch('/api/user/settings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedSettings),
            }).catch((err) => log.error(err));
          }
        },
      }),
      {
        name: 'user-settings-storage',
      },
    ),
  ),
);
