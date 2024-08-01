import CustomErrorPage from '@/app/components/CustomErrorPage';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export const metadata: Metadata = generateSharedMetadata(
  'Unauthorized',
  'You need to be logged in or have the right permissions to access this page',
);

export default function Unauthorized() {
  return (
    <CustomErrorPage
      title="Unauthorized Access"
      description="Oops! It looks like you're trying to access something without the proper credentials. Our mascot is sad because you need to be logged in or have the right permissions."
    />
  );
}
