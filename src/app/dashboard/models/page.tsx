import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard | Jaqpot',
  description: 'From model upload to prediction, all in one place',
};

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-5">
        Your models
      </h2>
      <ModelsTable />
    </div>
  );
}
