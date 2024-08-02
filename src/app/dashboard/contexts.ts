import { createContext, Dispatch, SetStateAction } from 'react';

export interface UserSettingsType {
  darkMode: boolean;
}

export type UserSettingsContextType = {
  userSettings: UserSettingsType | undefined;
  setUserSettings: Dispatch<SetStateAction<UserSettingsType | undefined>>;
};

export const UserSettingsContext = createContext<UserSettingsContextType>({
  userSettings: {
    darkMode: false,
  },
  setUserSettings: () => {},
});
