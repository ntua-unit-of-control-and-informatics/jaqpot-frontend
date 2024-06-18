import React from 'react';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import NewOrganization from '@/app/dashboard/new/organization/components/NewOrganization';

export const metadata: Metadata = generateSharedMetadata(
  'New organization',
  'Create a new organization',
);

export default function Page() {
  return <NewOrganization />;
}
