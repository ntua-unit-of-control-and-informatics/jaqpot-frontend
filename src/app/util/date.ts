import { formatDistance } from 'date-fns';

export function getUserFriendlyDate(date: Date) {
  return formatDistance(date, new Date(), { addSuffix: true });
}
