import { OrganizationDto } from '@/app/api.types';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';

interface OrganizationAffiliatedModelsTabProps {
  organization: OrganizationDto;
}

export default function OrganizationAffiliatedModelsTab({
  organization,
}: OrganizationAffiliatedModelsTabProps) {
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
