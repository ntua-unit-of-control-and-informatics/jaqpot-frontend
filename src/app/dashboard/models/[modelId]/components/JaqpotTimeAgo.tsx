'use client';

import { getUserFriendlyDateWithSuffix } from '@/app/util/date';

export default function JaqpotTimeAgo({ date }: { date: Date }) {
  return (
    <div title={date.toLocaleString()} className="whitespace-nowrap">
      {getUserFriendlyDateWithSuffix(date)}
    </div>
  );
}
