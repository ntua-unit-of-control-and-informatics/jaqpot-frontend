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
      <ModelsTable
        modelsEndpoint={`/api/organizations/${organization.name}/associated-models`}
      />
    </div>
  );
}
