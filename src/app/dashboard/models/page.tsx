import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';
import {
  generateSharedMetadata,
  jaqpotAppDescription,
  openGraphImage,
} from '@/app/shared.metadata';

export const metadata: Metadata = generateSharedMetadata(
  'Your models',
  'Access all your created models and explore models shared within your organizations on the Jaqpot predictive modeling platform. Manage and utilize models seamlessly in one place',
);

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-5">
        Your models
      </h2>
      <ModelsTable modelsEndpoint="/api/models" />

      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight my-5">
        Shared with you
      </h2>
      <ModelsTable modelsEndpoint="/api/shared-models" />
    </div>
  );
}
