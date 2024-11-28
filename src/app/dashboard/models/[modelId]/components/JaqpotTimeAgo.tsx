'use client';

import { getUserFriendlyDate } from '@/app/util/date';

export default function JaqpotTimeAgo({ date }: { date: Date }) {
  return (
    <div title={date.toLocaleString()} className="whitespace-nowrap">
      {getUserFriendlyDate(date)}
    </div>
  );
}
