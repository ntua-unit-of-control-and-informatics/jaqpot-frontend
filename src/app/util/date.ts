import { formatDistance } from 'date-fns';

export function getUserFriendlyDateWithSuffix(date: Date) {
  return formatDistance(date, new Date(), { addSuffix: true });
}

export function getUserFriendlyDuration(durationInMs: number) {
  return formatDistance(0, durationInMs, { includeSeconds: true });
}
