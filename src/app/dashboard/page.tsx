import { Metadata } from 'next';
import { generateSharedMetadata, openGraphImage } from '@/app/shared.metadata';
import DashboardBreadcrumbs from '@/app/dashboard/components/DashboardBreadcrumbs';
import DashboardStats from '@/app/dashboard/components/charts/DashboardStats';
import DashboardMostPopularModels from '@/app/dashboard/components/charts/DashboardMostPopularModels';

export const metadata: Metadata = generateSharedMetadata('Dashboard', '');

export default function Dashboard() {
  return (
    <div className="h-screen">
      <DashboardBreadcrumbs />

      <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 min-h-screen">
        <div>
          <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight my-5">
            Model predictions per day
          </h2>

          <DashboardStats width={'100%'} height={400} />
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight my-5">
            Most popular models last 7 days
          </h2>

          <DashboardMostPopularModels width={'100%'} height={400} />
        </div>
      </div>
    </div>
  );
}
