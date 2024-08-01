import { logger } from '@/logger';

const log = logger.child({ module: 'localStorageUtil' });

export const getItemFromLocalStorage = (
  key: string,
  defaultValue: any,
): any => {
  let currentValue;
  try {
    currentValue = JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultValue),
    );
  } catch (error) {
    log.warn("Couldn't parse user settings from local storage", error);
    return defaultValue;
  }

  return currentValue;
};
