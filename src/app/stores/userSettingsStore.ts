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
  clearUserSettings: () => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  devtools(
    persist(
      (set) => ({
        userSettings: {},
        updateUserSettings: async (updatedSettings, persist = true) => {
          if (persist) {
            try {
              const res = await fetch('/api/user/settings', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
              });

              const { success, message } = await res.json();
              if (success) {
                // toast.success('User settings updated successfully!');
              } else {
                log.error(`Error updating user settings:  ${message}`);
                // toast.error('Could not persist user settings');
              }
            } catch (e) {
              log.error('Error updating user settings', e);
              // toast.error('Could not persist user settings');
            } finally {
              set((state) => ({
                userSettings: { ...state.userSettings, ...updatedSettings },
              }));
            }
          } else {
            set((state) => ({
              userSettings: { ...state.userSettings, ...updatedSettings },
            }));
          }
        },
        clearUserSettings: () => {
          set({ userSettings: {} });
        },
      }),
      {
        name: 'user-settings-storage',
      },
    ),
  ),
);
