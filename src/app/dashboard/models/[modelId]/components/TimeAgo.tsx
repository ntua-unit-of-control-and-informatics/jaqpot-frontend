'use client';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

import ReactTimeAgo from 'react-time-ago';

export default function JaqpotTimeAgo({ date }: { date: Date }) {
  return <ReactTimeAgo date={date} />;
}
