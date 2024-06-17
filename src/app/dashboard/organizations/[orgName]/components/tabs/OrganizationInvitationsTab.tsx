'use client';

import {
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import React, { useState } from 'react';
import { organizationVisibilitySelectValues } from '@/app/types/organization-select.types';
import { PlusIcon } from '@heroicons/react/24/solid';
import InviteUsersButton from '@/app/dashboard/organizations/[orgName]/components/tabs/InviteUsersButton';

interface OrganizationInvitationsTabProps {
  organization: OrganizationDto;
}

export default function OrganizationInvitationsTab({
  organization,
}: OrganizationInvitationsTabProps) {
  return (
    <div>
      <InviteUsersButton />
    </div>
  );
}
