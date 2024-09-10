import { OrganizationDto } from '@/app/api.types';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';

interface OrganizationAssociatedModelsTabProps {
  organization: OrganizationDto;
}

export default function OrganizationSharedTab({
  organization,
}: OrganizationAssociatedModelsTabProps) {
  return (
    <div>
      <p className="mb-5 text-sm">
        This section showcases all the models that have been privately shared
        with your organization. Only members of your organization have access to
        view and use these models.
      </p>
      <ModelsTable
        modelsEndpoint={`/api/user/shared-models`}
        extraQueryParams={{ organizationId: organization.id!.toString() }}
      />
    </div>
  );
}
