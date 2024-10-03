import NotFound from '@/app/not-found';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export const metadata: Metadata = generateSharedMetadata(
  '404',
  'Page Not Found',
);

export default function DashboardNotFound() {
  return <NotFound />;
}
