import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';
import {
  generateSharedMetadata,
  jaqpotAppDescription,
  openGraphImage,
} from '@/app/shared.metadata';
import ModelsBreadcrumbs from '@/app/dashboard/models/components/ModelsBreadcrumbs';
import { useSearchParams } from 'next/navigation';
import SearchModelsBreadcrumbs from '@/app/dashboard/models/components/SearchModelsBreadcrumbs';
import SearchModelsTable from '@/app/dashboard/models/components/SearchModelsTable';

export const metadata: Metadata = generateSharedMetadata(
  'Search models',
  'Search all public models',
);

export default function Dashboard() {
  return (
    <div>
      <SearchModelsBreadcrumbs />

      <SearchModelsTable />
    </div>
  );
}
