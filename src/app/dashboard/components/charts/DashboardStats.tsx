'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import { format, sub } from 'date-fns';

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export default function DashboardStats({
  width,
  height,
}: {
  width: string | number;
  height: string | number;
}) {
  const data = [];
  const now = new Date();
  for (let day = 7; day >= 1; day--) {
    data.push({
      name: `${day} days ago`,
      x: format(sub(now, { days: day }), 'MM/dd/yyyy'),
      predictions: getRandomInt(100, 1500),
    });
  }

  return (
    <ResponsiveContainer
      width={width}
      height={height}
      className="p-5 border rounded-sm"
    >
      <BarChart data={data}>
        <XAxis dataKey="x" />
        <YAxis dataKey="predictions" />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Bar
          type="monotone"
          dataKey="predictions"
          fill="rgb(52 211 153)"
          maxBarSize={50}
          name="Predictions per day"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
