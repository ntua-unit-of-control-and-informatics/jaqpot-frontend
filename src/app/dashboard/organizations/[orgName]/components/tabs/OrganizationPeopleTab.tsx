'use client';

import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import React from 'react';
import { ArrowPathIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/solid';
import InviteUsersButton from '@/app/dashboard/organizations/[orgName]/components/tabs/InviteUsersButton';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import useSWR, { Fetcher } from 'swr';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { ApiResponse } from '@/app/util/response';
import { JaqpotCustomError } from '@/app/types/jaqpot-custom-error';
import { getUserFriendlyDateWithSuffix } from '@/app/util/date';
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import toast from 'react-hot-toast';
import PageHeading from '@/app/components/PageHeading';
import OrganizationInvitations from '@/app/dashboard/organizations/[orgName]/components/OrganizationInvitations';
import OrganizationMembers from '@/app/dashboard/organizations/[orgName]/components/OrganizationMembers';

interface OrganizationPeopleTabProps {
  organization: OrganizationDto;
}

export default function OrganizationPeopleTab({
  organization,
}: OrganizationPeopleTabProps) {
  return (
    <div>
      <PageHeading title={'Members'} className={'my-3'} />
      <div className="mb-10">
        <OrganizationMembers organization={organization} />
      </div>
      {organization.canEdit && (
        <>
          <PageHeading title={'Invitations'} className={'my-3'} />
          <OrganizationInvitations organization={organization} />
        </>
      )}
    </div>
  );
}
