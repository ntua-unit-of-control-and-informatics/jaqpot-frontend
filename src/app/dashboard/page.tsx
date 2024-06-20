import { Metadata } from 'next';
import { generateSharedMetadata, openGraphImage } from '@/app/shared.metadata';
import DashboardBreadcrumbs from '@/app/dashboard/components/DashboardBreadcrumbs';
import DashboardStats from '@/app/dashboard/components/DashboardStats';
import { ResponsiveContainer } from 'recharts';

export const metadata: Metadata = generateSharedMetadata('Dashboard', '');

export default function Dashboard() {
  return (
    <div className="h-screen">
      <DashboardBreadcrumbs />

      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight my-5">
        Model predictions per day
      </h2>

      <DashboardStats width={'100%'} height="40%" />
    </div>
  );
}
