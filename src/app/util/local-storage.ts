import { logger } from '@/logger';

const log = logger.child({ module: 'localStorageUtil' });

export const getItemFromLocalStorage = (key: string): any | undefined => {
  let currentValue;
  if (!localStorage) {
    return undefined;
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) return undefined;
    currentValue = JSON.parse(item);
  } catch (error) {
    log.warn("Couldn't parse user settings from local storage", error);
    return undefined;
  }

  return currentValue;
};
