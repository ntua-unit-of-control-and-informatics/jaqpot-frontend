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

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export default function DashboardMostPopularModels({
  width,
  height,
}: {
  width: string | number;
  height: string | number;
}) {
  const data = [];
  const now = new Date();
  let randomInt = getRandomInt(1000, 1500);
  for (let i = 7; i >= 1; i--) {
    randomInt -= getRandomInt(20, 200);
    data.push({
      name: `Linear regression ${i}`,
      predictions: randomInt,
    });
  }

  return (
    <ResponsiveContainer width={width} height={height} className="p-2 resize">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis dataKey="predictions" />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Bar
          type="monotone"
          dataKey="predictions"
          fill="rgb(34 211 238)"
          maxBarSize={50}
          name="Most popular models predictions"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
