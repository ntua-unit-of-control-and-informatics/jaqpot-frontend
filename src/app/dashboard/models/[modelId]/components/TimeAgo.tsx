'use client';

import { formatDistance } from 'date-fns';
import { getUserFriendlyDate } from '@/app/util/date';

export default function JaqpotTimeAgo({ date }: { date: Date }) {
  return <div>{getUserFriendlyDate(date)}</div>;
}
