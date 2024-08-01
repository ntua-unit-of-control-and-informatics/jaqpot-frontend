import { useEffect, useState } from 'react';
import { logger } from '@/logger';

const log = logger.child({ module: 'dataset' });

export interface UserSettingsType {
  darkMode: boolean;
}

const defaultUserSettings: UserSettingsType = {
  darkMode: false,
};

const getItemFromLocalStorage = (key: string): UserSettingsType => {
  let currentValue;
  try {
    currentValue = JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultUserSettings),
    );
  } catch (error) {
    log.warn("Couldn't parse user settings from local storage", error);
    return defaultUserSettings;
  }

  return currentValue;
};

const useUserSettings = (userId: string) => {
  const key = `jaqpot-user-settings-${userId}`;

  const [userSettings, setUserSettings] = useState<UserSettingsType>(() => {
    if (!userId) return defaultUserSettings;
    return getItemFromLocalStorage(key);
  });

  useEffect(() => {
    if (!userId || !userSettings) return;
    localStorage.setItem(key, JSON.stringify(userSettings));
  }, [userSettings]);

  return { userSettings, setUserSettings };
};

export default useUserSettings;
