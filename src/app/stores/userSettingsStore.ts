import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension';
import { UserSettingsDto } from '@/app/api.types'; // required for devtools typing

interface UserSettingsState {
  userSettings: UserSettingsDto;
  updateUserSettings: (updatedSettings: Partial<UserSettingsDto>) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  devtools(
    persist(
      (set) => ({
        userSettings: {},
        updateUserSettings: (updatedSettings) => {
          set((state) => ({
            userSettings: { ...state.userSettings, ...updatedSettings },
          }));
        },
      }),
      {
        name: 'user-settings-storage',
      },
    ),
  ),
);
