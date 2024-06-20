'use client';

import { formatDistance } from 'date-fns';

export default function JaqpotTimeAgo({ date }: { date: Date }) {
  return <div>{formatDistance(date, new Date(), { addSuffix: true })}</div>;
}
