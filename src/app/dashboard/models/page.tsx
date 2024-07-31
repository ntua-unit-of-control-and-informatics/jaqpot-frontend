import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';
import {
  generateSharedMetadata,
  jaqpotAppDescription,
  openGraphImage,
} from '@/app/shared.metadata';
import ModelsBreadcrumbs from '@/app/dashboard/models/components/ModelsBreadcrumbs';

export const metadata: Metadata = generateSharedMetadata(
  'Your models',
  'Access all your created models and explore models shared within your organizations on the Jaqpot predictive modeling platform. Manage and utilize models seamlessly in one place',
);

export default function ModelsPage() {
  return (
    <div>
      <ModelsBreadcrumbs />
      <h2 className="mb-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Your models
      </h2>
      <ModelsTable modelsEndpoint="/api/user/models" />

      <h2 className="my-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Shared with you via your organizations
      </h2>
      <ModelsTable modelsEndpoint="/api/user/shared-models" />
    </div>
  );
}
