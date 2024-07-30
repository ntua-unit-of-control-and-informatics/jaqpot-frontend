import { OrganizationDto } from '@/app/api.types';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';

interface OrganizationAssociatedModelsTabProps {
  organization: OrganizationDto;
}

export default function OrganizationAssociatedModelsTab({
  organization,
}: OrganizationAssociatedModelsTabProps) {
  return (
    <div>
      <p className="mb-4 text-sm">
        These models were developed under the auspices of this
        project/organization.
      </p>
      <ModelsTable
        modelsEndpoint={`/api/organizations/${organization.name}/affiliated-models`}
      />
    </div>
  );
}
