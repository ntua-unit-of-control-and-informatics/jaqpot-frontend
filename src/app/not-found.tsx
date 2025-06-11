import CustomErrorPage from '@/app/components/CustomErrorPage';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export const metadata: Metadata = generateSharedMetadata(
  '404',
  'Page Not Found',
);

export default function NotFound() {
  return (
    <CustomErrorPage
      title="404 - Page Not Found"
      description="Oops! It looks like you are lost. Our mascot is empty-handed and sad
        because the page you are looking for does not exist."
    />
  );
}
